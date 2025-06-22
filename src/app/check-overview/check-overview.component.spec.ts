import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {CheckOverviewComponent} from './check-overview.component';
import {DailyCheck, QuestionCategory} from '../model/DailyCheck';
import {of} from 'rxjs';
import {DailyCheckService} from '../service/daily-check.service';
import {TranslateTestingModule} from 'ngx-translate-testing';

describe('OverviewComponent', () => {
  let component: CheckOverviewComponent;
  let fixture: ComponentFixture<CheckOverviewComponent>;
  const mockCheckIn: DailyCheck = {
    id: new Date('2025-01-01').getTime(),
    completed: true,
    userFirstName: 'Alice',
    checkInDate: '2025-01-01',
    questions: [
      { id: 1, category: QuestionCategory.MENTAL, content: 'Mental?', contentDe: '', contentHr: '', score: 3 },
      { id: 2, category: QuestionCategory.EMOTIONAL, content: 'Emotional?', contentDe: '', contentHr: '', score: 4 },
      { id: 3, category: QuestionCategory.PHYSICAL, content: 'Physical?', contentDe: '', contentHr: '', score: 2 },
      { id: 4, category: QuestionCategory.SOCIAL, content: 'Social?', contentDe: '', contentHr: '', score: 5 },
    ]
  }

  beforeEach(async () => {

    class MockDailyCheckService {
      getCompletedCheckIns() {
        return of([mockCheckIn]);
      }
    }

    await TestBed.configureTestingModule({
      imports: [
        CheckOverviewComponent,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({ en: require('../../../src/assets/i18n/en.json')})
      ],
      providers: [
        { provide: DailyCheckService, useClass: MockDailyCheckService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckOverviewComponent);
    component = fixture.componentInstance;

    component.allCheckins = [mockCheckIn];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.checkinsForm.value).toEqual({ startDate: '', endDate: '' });
  });

  it('should return average score correctly', () => {
    const avg = component.getAverageScore(component.allCheckins[0]);
    expect(avg).toBe(3.5);
  });

  it('should filter check-ins between date range', () => {
    component.checkinsForm.setValue({
      startDate: '2025-01-01',
      endDate: '2025-01-01'
    });
    component.filterCheckins();
    expect(component.filteredCheckins.length).toBe(1);
  });

  it('should return empty array if no check-ins match date filter', () => {
    component.checkinsForm.setValue({
      startDate: '2025-02-01',
      endDate: '2025-02-05'
    });
    component.filterCheckins();
    expect(component.filteredCheckins.length).toBe(0);
  });

  it('should paginate correctly: 1 item in first page', () => {
    component.filteredCheckins = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      completed: true,
      userFirstName: 'Test',
      questions: new Array(4).fill({
        id: 1,
        category: QuestionCategory.MENTAL,
        content: '',
        contentDe: '',
        contentHr: '',
        score: 3
      })
    }));

    component.itemsPerPage = 5;
    component.currentPage = 1;
    const pageOne = component.paginatedCheckins;
    expect(pageOne.length).toBe(5);

    component.currentPage = 2;
    const pageTwo = component.paginatedCheckins;
    expect(pageTwo.length).toBe(2);
  });

  it('getScoreLabel should return string value of score', () => {
    expect(component.getScoreLabel(3)).toBe('3');
    expect(component.getScoreLabel(null)).toBe('N/A');
  });

  it('getCategoryIcon should return correct emoji', () => {
    expect(component.getCategoryIcon(QuestionCategory.MENTAL)).toBe('🧠');
    expect(component.getCategoryIcon('UNKNOWN' as any)).toBe('❓');
  });

  it('getPageEnd should return correct visible item count', () => {
    component.filteredCheckins = new Array(7).fill({});
    component.itemsPerPage = 5;
    component.currentPage = 1;
    expect(component.getPageEnd()).toBe(5);
    component.currentPage = 2;
    expect(component.getPageEnd()).toBe(7);
  });
});
