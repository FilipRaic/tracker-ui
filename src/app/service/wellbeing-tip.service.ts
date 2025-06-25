import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WellbeingTip } from '../model/WellbeingTip';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TipService {
  private apiUrl = '/api/tip';
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}


  getTips(): Observable<WellbeingTip[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User ID not available');
    }

    return this.http.get<WellbeingTip[]>(`${this.apiUrl}/${userId}`);
  }

  getStreak(): Observable<Number> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User ID not available');
    }

    return this.http.get<Number>(`${this.apiUrl}/streak/${userId}`);
  }
}