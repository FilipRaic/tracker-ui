import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HabitStatusComponent } from './habit-status.component';
import { HabitService } from '../service/habit.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {TranslateTestingModule} from 'ngx-translate-testing';

describe('HabitStatusComponent', () => {
  let component: HabitStatusComponent;
  let fixture: ComponentFixture<HabitStatusComponent>;
  let mockHabitService: any;

  const mockHabits = [
    {
      id: 1,
      name: 'Meditation',
      dueDate: '2099-12-31',
      done: false,
      notes: 'Relax daily',
      frequency: 'day',
      startDate: '2025-01-01'
    }
  ];

  beforeEach(waitForAsync(() => {
    mockHabitService = {
      getCurrentHabitsWithStatus: jest.fn().mockReturnValue(of(mockHabits)),
      markHabitAsDoneToday: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [
        HabitStatusComponent,
        TranslateTestingModule.withTranslations({ en: require('../../../src/assets/i18n/en.json')})
      ],
      providers: [{ provide: HabitService, useValue: mockHabitService }]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HabitStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the component and load habits', () => {
    expect(component).toBeTruthy();
    expect(component.habitsDue.length).toBe(1);
    const habitText = fixture.debugElement.query(By.css('[data-testid="habitNameLabel"]')).nativeElement.textContent;
    expect(habitText).toContain('Meditation');
  });

  it('should show loading skeleton initially', waitForAsync(() => {
    component.loading = true;
    fixture.detectChanges();
    const skeletons = fixture.debugElement.queryAll(By.css('.placeholder'));
    expect(skeletons.length).toBeGreaterThan(0);
  }));

  it('should show notes if present', () => {
    const notesEl = fixture.debugElement.query(By.css('[data-testid="habitNotesLabel"]')).nativeElement;
    expect(notesEl).toBeTruthy();
    expect(notesEl.textContent).toContain('Relax daily');
  });

  it('should show due date and time remaining', () => {
    const dueDate = fixture.debugElement.query(By.css('[data-testid="habitDueDateLabel"]')).nativeElement.textContent;
    const timeRemaining = fixture.debugElement.query(By.css('[data-testid="habitTimeRemainingLabel"]')).nativeElement.textContent;
    expect(dueDate).toContain('Due: 2099-12-31');
    expect(timeRemaining).toContain('remaining');
  });

  it('should mark habit as done when button clicked', () => {
    const button = fixture.debugElement.query(By.css('[data-testid="markDoneButton"]')).nativeElement;
    expect(button.disabled).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(mockHabitService.markHabitAsDoneToday).toHaveBeenCalledWith(1);
    expect(component.habitsDue[0].done).toBe(true);
  });

  it('should disable button when habit is done', () => {
    component.habitsDue[0].done = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testid="markDoneButton"]')).nativeElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('✓ Done');
  });

  it('should display "No habits" message if list is empty', () => {
    component.habitsDue = [];
    component.loading = false;
    fixture.detectChanges();

    const noHabitsEl = fixture.debugElement.query(By.css('[data-testid="noHabitsMessage"]')).nativeElement;
    expect(noHabitsEl).toBeTruthy();
    expect(noHabitsEl.textContent).toContain('No habits to complete today');
  });
});
