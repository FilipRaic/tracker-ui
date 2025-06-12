import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../model/Achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/api/achievement';

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(this.apiUrl);
  }
}