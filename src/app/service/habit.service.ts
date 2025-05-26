import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Habit} from '../model/Habit';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = 'http://localhost:8080/api/habits';
  private httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  constructor(private http: HttpClient) {}

  getAllHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.apiUrl, this.httpOptions);
  }

  createHabit(habit: Habit): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, habit, this.httpOptions);
  }
}
