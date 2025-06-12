import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import {LoginRequest, LoginResponse, RegisterRequest, User} from '../model/Auth';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = '/api/auth';
  private readonly accessTokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';

  private readonly currentUserSubject: BehaviorSubject<User | null>;
  private readonly currentUser$: Observable<User | null>;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    const token = this.getAccessToken();
    const user = token ? this.getUserFromToken(token) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);

          const user = this.getUserFromToken(response.accessToken);
          this.currentUserSubject.next(user);
        })
      );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => {
        let errorMessage = '';
        this.translate.get('AUTH.NO_REFRESH_TOKEN').subscribe(translation => {
          errorMessage = translation;
        });
        return new Error(errorMessage);
      });
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, {refreshToken})
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);

          const user = this.getUserFromToken(response.accessToken);
          this.currentUserSubject.next(user);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, registerRequest);
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      this.translate.get('AUTH.ERROR_DECODING_TOKEN').subscribe(translation => {
        console.error(translation, e);
      });
      return null;
    }
  }

  private getUserFromToken(token: string): User | null {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }

    return {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role
    };
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  private setRefreshToken(token: string): void {
    sessionStorage.setItem(this.refreshTokenKey, token);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
  }
}
