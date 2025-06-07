import {TestBed} from '@angular/core/testing';
import {JournalService} from './journal.service';
import {JournalEntry} from '../model/JournalEntry';
import {HttpClient} from '@angular/common/http';
import {instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';

const JOURNAL_API_URL = 'http://localhost:8080/api/journal';

describe('JournalService', () => {
  const httpClientMock = mock(HttpClient);

  let journalService: JournalService = new JournalService(httpClientMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [JournalService, {provide: HttpClient, useValue: instance(httpClientMock)}],
    });
    journalService = TestBed.inject(JournalService);
  });

  describe('Get all entries', () => {
    it('should return an Observable of JournalEntry array', () => {
      const givenEntries: JournalEntry[] = [
        {id: 1, description: 'Test entry 1', date: '2025-05-28'},
        {id: 2, description: 'Test entry 2', date: '2025-06-01'}
      ];

      when(httpClientMock.get<JournalEntry[]>(JOURNAL_API_URL)).thenReturn(of(givenEntries));

      journalService.getAllEntries().subscribe(entries => {
        expect(entries.length).toBe(2);
        expect(entries).toEqual(givenEntries);
      });
    });
  });

  describe('Get entry by date', () => {
    it('should return an Observable of JournalEntry', () => {
      const date = '2025-05-28';
      const givenEntry: JournalEntry = {id: 1, description: 'Test entry 1', date};

      when(httpClientMock.get<JournalEntry>(`${JOURNAL_API_URL}/${date}`)).thenReturn(of(givenEntry));

      journalService.getEntryByDate(date).subscribe(entry => {
        expect(entry).toEqual(givenEntry);
      });
    });
  });

  describe('Add new entry', () => {
    it('should create a new entry and return it', () => {
      const givenEntry: JournalEntry = {
        description: 'New test entry',
        date: '2025-05-28'
      };
      const expectedEntry: JournalEntry = {id: 1, ...givenEntry};

      when(httpClientMock.post<JournalEntry>(JOURNAL_API_URL, givenEntry)).thenReturn(of(expectedEntry));

      journalService.addEntry(givenEntry).subscribe(entry => {
        expect(entry).toEqual(expectedEntry);
      });
    });
  });

  describe('Update entry', () => {
    it('should update an existing entry and return it', () => {
      const givenEntry: JournalEntry = {
        id: 1,
        description: 'Updated test entry',
        date: '2025-05-28'
      };

      when(httpClientMock.put<JournalEntry>(`${JOURNAL_API_URL}/${givenEntry.date}`, givenEntry)).thenReturn(of(givenEntry));

      journalService.putEntry(givenEntry).subscribe(entry => {
        expect(entry).toEqual(givenEntry);
      });
    });
  });

  describe('Delete entry', () => {
    it('should delete an entry by date', () => {
      const date = '2025-05-28';

      when(httpClientMock.delete<void>(`${JOURNAL_API_URL}/${date}`)).thenReturn(of(void 0));

      journalService.deleteEntry(date).subscribe(result => {
        expect(result).toBeUndefined();
      });
    });
  });
});
