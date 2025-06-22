import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DailyCheck, DailyCheckSubmit} from '../model/DailyCheck';

@Injectable({
  providedIn: 'root'
})
export class DailyCheckService {
  private readonly apiUrl = '/api/daily-check';

  constructor(private readonly http: HttpClient) {
  }

  getCompletedCheckIns(): Observable<DailyCheck[]> {
    return this.http.get<DailyCheck[]>(`${this.apiUrl}/completed`);
  }

  getCheckInByUuid(uuid: string): Observable<DailyCheck> {
    return this.http.get<DailyCheck>(`${this.apiUrl}/public/${uuid}`);
  }

  submitDailyCheck(dailyCheckSubmit: DailyCheckSubmit): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/public/submit`, dailyCheckSubmit);
  }
}
