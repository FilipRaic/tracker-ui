import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Habit, HabitStatus} from '../model/Habit';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly apiUrl = '/api/habits';

  constructor(private readonly http: HttpClient) {
  }

  getAllHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  getCurrentHabitsWithStatus(): Observable<HabitStatus[]> {
    return this.http.get<HabitStatus[]>(this.apiUrl + '/status');
  }

  createHabit(habit: Habit): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, habit);
  }

  markHabitAsDoneToday(habitId: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + `/status/${habitId}`, {});
  }
}
