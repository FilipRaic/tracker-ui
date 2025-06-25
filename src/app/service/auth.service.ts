import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, User} from '../model/Auth';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = '/api/auth';
  private readonly accessTokenKey = 'auth_token';

  private readonly currentUserSubject: BehaviorSubject<User | null>;
  private readonly currentUser$: Observable<User | null>;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly notificationService: NotificationService
  ) {
    const token = this.getAccessToken();
    const user = token ? this.getUserFromToken(token) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  login(loginRequest: LoginRequest): void {
    this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);

          const user = this.getUserFromToken(response.accessToken);
          this.currentUserSubject.next(user);
        }),
      ).subscribe(() => this.router.navigate(['/']).then());
  }

  register(registerRequest: RegisterRequest): void {
    this.http.post<void>(`${this.apiUrl}/register`, registerRequest)
      .subscribe(() => {
        this.translate.get('REGISTER.SUCCESS_MESSAGE').subscribe(translation => {
          this.notificationService.addNotification(translation, 'success');
        });
        this.router.navigate(['/login']).then();
      });
  }

  sendForgotPasswordEmail(email: string): void {
    this.http.post<void>(`${this.apiUrl}/forgot-password/send`, {email})
      .subscribe(() => {
        this.translate.get('FORGOT_PASSWORD.SUCCESS').subscribe(translation => {
          this.notificationService.addNotification(translation, 'success');
        });
      })
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest, token: string): void {
    this.http.post<void>(`${this.apiUrl}/reset-password`, resetPasswordRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(() => {
      this.translate.get('RESET_PASSWORD.SUCCESS').subscribe(translation => {
        this.notificationService.addNotification(translation, 'success');
      });
      this.router.navigate(['/login']).then();
    })
  }

  logout(): void {
    this.clearToken();
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

  private clearToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }
  public getCurrentUserId(): number | null {
    const token = this.getAccessToken();
    const user = token ? this.getUserFromToken(token) : null;
    return user?.id ?? null;
}
}
