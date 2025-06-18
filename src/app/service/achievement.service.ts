import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../model/Achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = '/api/achievement';

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.apiUrl);
  }
}
