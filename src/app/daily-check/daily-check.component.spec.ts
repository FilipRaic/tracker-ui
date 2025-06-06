import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

import {DailyCheckComponent} from './daily-check.component';
import {DailyCheckService} from '../service/daily-check.service';
import {NotificationService} from '../service/notification.service';
import {DailyCheck, DailyQuestion, QuestionCategory} from '../model/DailyCheck';

describe('DailyCheckComponent', () => {
  let component: DailyCheckComponent;
  let fixture: ComponentFixture<DailyCheckComponent>;
  let mockDailyCheckService: jasmine.SpyObj<DailyCheckService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockQuestions: DailyQuestion[] = [
    {
      id: 1,
      category: QuestionCategory.MENTAL,
      content: 'How is your mental health today?',
      score: null
    },
    {
      id: 2,
      category: QuestionCategory.EMOTIONAL,
      content: 'How are you feeling emotionally?',
      score: null
    },
    {
      id: 3,
      category: QuestionCategory.PHYSICAL,
      content: 'How is your physical health?',
      score: null
    }
  ];

  const mockDailyCheck: DailyCheck = {
    id: 123,
    questions: mockQuestions,
    completed: false
  };

  beforeEach(async () => {
    mockDailyCheckService = jasmine.createSpyObj('DailyCheckService', ['getCheckInByUuid', 'submitDailyCheck']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['addNotification']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      params: of({uuid: 'test-uuid'})
    };

    mockDailyCheckService.getCheckInByUuid.and.returnValue(of(mockDailyCheck));
    mockDailyCheckService.submitDailyCheck.and.returnValue(of(void 0));
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [DailyCheckComponent],
      providers: [
        {provide: DailyCheckService, useValue: mockDailyCheckService},
        {provide: NotificationService, useValue: mockNotificationService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load daily check on init', () => {
    expect(mockDailyCheckService.getCheckInByUuid).toHaveBeenCalledWith('test-uuid');
  });

  it('should display the first question initially', () => {
    const questionContent = fixture.debugElement.query(By.css('[data-testid="question-content"]'));
    expect(questionContent.nativeElement.textContent).toContain('How is your mental health today?');
  });

  it('should display progress indicators for all questions', () => {
    const stepIndicators = fixture.debugElement.queryAll(By.css('[data-testid^="step-indicator-"]'));
    expect(stepIndicators.length).toBe(3);
  });

  it('should mark the first question as active initially', () => {
    const activeIndicator = fixture.debugElement.query(By.css('.step-indicator.active'));
    expect(activeIndicator).toBeTruthy();
    expect(activeIndicator.nativeElement.getAttribute('data-testid')).toBe('step-indicator-0');
  });

  it('should display score buttons', () => {
    const scoreButtons = fixture.debugElement.queryAll(By.css('[data-testid^="score-button-"]'));
    expect(scoreButtons.length).toBe(5);

    for (let i = 0; i < 5; i++) {
      expect(scoreButtons[i].nativeElement.textContent.trim()).toBe((i + 1).toString());
    }
  });

  it('should not show previous button on first question', () => {
    const previousButton = fixture.debugElement.query(By.css('[data-testid="previous-button"]'));
    expect(previousButton).toBeNull();
  });

  it('should show next button as disabled initially', () => {
    const nextButton = fixture.debugElement.query(By.css('[data-testid="next-button"]'));
    expect(nextButton.nativeElement.disabled).toBe(true);
  });

  it('should enable next button when question is answered', () => {
    component.setScore(mockQuestions[0], 3);
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('[data-testid="next-button"]'));
    expect(nextButton.nativeElement.disabled).toBe(false);
  });

  it('should navigate to next question when next button is clicked', () => {
    component.setScore(mockQuestions[0], 3);
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('[data-testid="next-button"]'));
    nextButton.nativeElement.click();
    fixture.detectChanges();

    const questionContent = fixture.debugElement.query(By.css('[data-testid="question-content"]'));
    expect(questionContent.nativeElement.textContent).toContain('How are you feeling emotionally?');
    expect(component.currentQuestionIndex).toBe(1);
  });

  it('should navigate to previous question when previous button is clicked', () => {
    component.setScore(mockQuestions[0], 3);
    component.nextQuestion(mockDailyCheck);
    fixture.detectChanges();

    const previousButton = fixture.debugElement.query(By.css('[data-testid="previous-button"]'));
    previousButton.nativeElement.click();
    fixture.detectChanges();

    const questionContent = fixture.debugElement.query(By.css('[data-testid="question-content"]'));
    expect(questionContent.nativeElement.textContent).toContain('How is your mental health today?');
    expect(component.currentQuestionIndex).toBe(0);
  });

  it('should mark questions as answered in the progress indicators', () => {
    component.setScore(mockQuestions[0], 3);
    fixture.detectChanges();

    const completedIndicator = fixture.debugElement.query(By.css('.step-indicator.completed'));
    expect(completedIndicator).toBeTruthy();
    expect(completedIndicator.nativeElement.getAttribute('data-testid')).toBe('step-indicator-0');
  });

  it('should show submit text on last question', () => {
    component.setScore(mockQuestions[0], 3);
    component.nextQuestion(mockDailyCheck);
    component.setScore(mockQuestions[1], 4);
    component.nextQuestion(mockDailyCheck);
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('[data-testid="next-button"]'));
    expect(nextButton.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should submit daily check when all questions are answered and submit button is clicked', () => {
    component.setScore(mockQuestions[0], 3);
    component.nextQuestion(mockDailyCheck);
    component.setScore(mockQuestions[1], 4);
    component.nextQuestion(mockDailyCheck);
    component.setScore(mockQuestions[2], 5);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('[data-testid="next-button"]'));
    submitButton.nativeElement.click();

    expect(mockDailyCheckService.submitDailyCheck).toHaveBeenCalled();
    const submittedData = mockDailyCheckService.submitDailyCheck.calls.mostRecent().args[0];
    expect(submittedData.id).toBe(123);
    expect(submittedData.questions.length).toBe(3);
    expect(submittedData.questions[0].score).toBe(3);
    expect(submittedData.questions[1].score).toBe(4);
    expect(submittedData.questions[2].score).toBe(5);
  });

  it('should show notification and navigate home after successful submission', () => {
    component.setScore(mockQuestions[0], 3);
    component.setScore(mockQuestions[1], 4);
    component.setScore(mockQuestions[2], 5);
    component.submitDailyCheck(mockDailyCheck);

    expect(mockNotificationService.addNotification).toHaveBeenCalledWith('Daily check submitted', 'success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error notification if trying to submit with unanswered questions', () => {
    const question = mockDailyCheck.questions[0];
    question.score = null;

    component.submitDailyCheck(mockDailyCheck);

    expect(mockNotificationService.addNotification).toHaveBeenCalledWith('Please answer all questions before submitting', 'error');
    expect(mockDailyCheckService.submitDailyCheck).not.toHaveBeenCalled();
  });
});
