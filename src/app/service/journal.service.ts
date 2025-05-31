import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalEntry } from '../model/JournalEntry';

@Injectable({ providedIn: 'root' })
export class JournalService {
  private apiUrl = 'http://localhost:8080/api/journal';

  constructor(private http: HttpClient) {}

  getAllEntries(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl);
  }

  getEntryByDate(date: string): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${this.apiUrl}/${date}`);
  }

  addEntry(entry: JournalEntry): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, entry);
  }

  putEntry(entry: JournalEntry): Observable<JournalEntry> {
  return this.http.put<JournalEntry>(`${this.apiUrl}/${entry.date}`, entry);
}
}