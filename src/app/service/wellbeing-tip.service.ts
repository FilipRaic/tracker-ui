import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WellbeingTip } from '../model/WellbeingTip';

@Injectable({
  providedIn: 'root',
})
export class TipService {
  private apiUrl = 'http://localhost:8080/api/tip';

  constructor(private http: HttpClient) {}

  getTips(): Observable<WellbeingTip[]> {
    return this.http.get<WellbeingTip[]>(this.apiUrl);
  }
}