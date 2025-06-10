import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {of, throwError} from 'rxjs';

import {JournalComponent} from './journal.component';
import {JournalService} from '../service/journal.service';
import {JournalEntry} from '../model/JournalEntry';
import {TranslateTestingModule} from 'ngx-translate-testing';

describe('JournalComponent', () => {
  let component: JournalComponent;
  let fixture: ComponentFixture<JournalComponent>;
  let mockJournalService: jasmine.SpyObj<JournalService>;

  const mockEntries: JournalEntry[] = [
    {id: 1, description: 'Test entry 1', date: '2025-05-28'},
    {id: 2, description: 'Test entry 2', date: '2025-06-01'}
  ];

  const mockEntry: JournalEntry = {
    id: 1,
    description: 'Test entry 1',
    date: '2025-05-28'
  };

  beforeEach(async () => {
    mockJournalService = jasmine.createSpyObj('JournalService', [
      'getAllEntries',
      'getEntryByDate',
      'addEntry',
      'putEntry',
      'deleteEntry'
    ]);

    mockJournalService.getAllEntries.and.returnValue(of(mockEntries));
    mockJournalService.getEntryByDate.and.returnValue(of(mockEntry));
    mockJournalService.addEntry.and.returnValue(of(mockEntry));
    mockJournalService.putEntry.and.returnValue(of(mockEntry));
    mockJournalService.deleteEntry.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        JournalComponent,
        FormsModule,
        TranslateTestingModule.withTranslations({ en: require('../../../src/assets/i18n/en.json')})],
      providers: [
        {provide: JournalService, useValue: mockJournalService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalComponent);
    component = fixture.componentInstance;

    // Use a fixed date for testing
    const fixedDate = new Date('2025-05-28T00:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entries on init', () => {
    expect(mockJournalService.getAllEntries).toHaveBeenCalled();
    expect(component.entries.length).toBe(2);
    expect(component.entries[0].date).toBe('2025-06-01');
  });

  it('should try to load today\'s entry on init', () => {
    expect(mockJournalService.getEntryByDate).toHaveBeenCalledWith('2025-05-28');
    expect(component.newEntry.date).toBe('2025-05-28');
    expect(component.newEntry.description).toBe('Test entry 1');
  });

  it('should handle error when loading today\'s entry', () => {
    component = new JournalComponent(mockJournalService);

    mockJournalService.getEntryByDate.and.returnValue(throwError(() => new Error('Not found')));
    component.ngOnInit();

    expect(component.newEntry.date).toBe('2025-05-28');
    expect(component.newEntry.description).toBe('');
  });

  it('should select an entry when a date is clicked', () => {
    const date = '2025-05-28';
    component.selectEntry(date);

    expect(mockJournalService.getEntryByDate).toHaveBeenCalledWith(date);
    expect(component.selectedEntry).toEqual(mockEntry);
  });

  it('should delete the selected entry', () => {
    component.selectedEntry = mockEntry;

    component.deleteEntry();

    expect(mockJournalService.deleteEntry).toHaveBeenCalledWith('2025-05-28');
    expect(component.entries.length).toBe(1);
    expect(component.selectedEntry).toBeNull();
  });

  it('should add a new entry when no entry exists for today', () => {
    component.entries = [{id: 2, description: 'Test entry 2', date: '2025-06-01'}];
    component.newEntry = {description: 'New entry for today', date: '2025-05-28'};
    component.addEntry();

    expect(mockJournalService.addEntry).toHaveBeenCalledWith(component.newEntry);
    expect(mockJournalService.getAllEntries).toHaveBeenCalled();
    expect(mockJournalService.getEntryByDate).toHaveBeenCalledWith('2025-05-28');
    expect(component.entrySubmitted).toBe(true);
  });

  it('should update an existing entry for today', () => {
    component.entries = mockEntries;
    component.newEntry = {description: 'Updated entry for today', date: '2025-05-28'};

    component.addEntry();

    expect(mockJournalService.putEntry).toHaveBeenCalledWith(component.newEntry);
    expect(mockJournalService.getAllEntries).toHaveBeenCalled();
    expect(mockJournalService.getEntryByDate).toHaveBeenCalledWith('2025-05-28');
    expect(component.entrySubmitted).toBe(true);
  });

  it('should reset entrySubmitted after 3 seconds', () => {
    jest.useFakeTimers();

    component.entrySubmitted = true;
    component.addEntry();

    expect(component.entrySubmitted).toBe(true);

    jest.advanceTimersByTime(3000);

    expect(component.entrySubmitted).toBe(false);

    jest.useRealTimers();
  });

  it('should display the list of entries', () => {
    const entryElements = fixture.debugElement.queryAll(By.css('[data-testid="entry-date-item"]'));
    expect(entryElements.length).toBe(2);
  });

  it('should display the selected entry when one is selected', () => {
    component.selectedEntry = mockEntry;
    fixture.detectChanges();

    const entryText = fixture.debugElement.query(By.css('[data-testid="entry-content"]')).nativeElement.textContent;
    expect(entryText).toBe('Test entry 1');
  });

  it('should display a message when no entries exist', () => {
    component.entries = [];
    fixture.detectChanges();

    const noEntriesMessage = fixture.debugElement.query(By.css('[data-testid="no-entries-message"]')).nativeElement.textContent;
    expect(noEntriesMessage.trim()).toBe('You haven\'t written any journal entries yet. Start journaling to track your thoughts and feelings!');
  });

  it('should display a message when entries exist but none is selected', () => {
    component.selectedEntry = null;
    fixture.detectChanges();

    const selectEntryMessage = fixture.debugElement.query(By.css('[data-testid="select-entry-message"]')).nativeElement.textContent;
    expect(selectEntryMessage.trim()).toBe('Click a date to view the entry.');
  });

  it('should show the delete button only when an entry is selected', () => {
    component.selectedEntry = null;
    fixture.detectChanges();

    let deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-entry-button"]'));
    expect(deleteButton).toBeNull();

    component.selectedEntry = mockEntry;
    fixture.detectChanges();

    deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-entry-button"]'));
    expect(deleteButton).not.toBeNull();
    expect(deleteButton.nativeElement.textContent.trim()).toBe('Delete');
  });

  it('should show success message when entry is submitted', () => {
    let successMessage = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
    expect(successMessage).toBeNull();

    component.entrySubmitted = true;
    fixture.detectChanges();

    successMessage = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
    expect(successMessage).not.toBeNull();
    expect(successMessage.nativeElement.textContent.trim()).toBe('Journal entry saved successfully!');
  });
});
