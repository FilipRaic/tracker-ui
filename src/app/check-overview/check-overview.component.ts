import {Component, OnDestroy, OnInit} from '@angular/core';
import {DailyCheck, QuestionCategory} from '../model/DailyCheck';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DailyCheckService} from '../service/daily-check.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {NotificationService} from '../service/notification.service';

@Component({
  selector: 'app-check-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './check-overview.component.html',
  styleUrl: './check-overview.component.scss'
})
export class CheckOverviewComponent implements OnInit, OnDestroy{
  checkinsForm: FormGroup;
  currentLang = 'en';
  private langSub!: Subscription;

  allCheckins: DailyCheck[] = [];
  filteredCheckins: DailyCheck[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private fb: FormBuilder,
              private readonly dailyCheckService: DailyCheckService,
              private readonly translate: TranslateService,
              private notificationService: NotificationService) {
    this.checkinsForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    if(this.translate.currentLang != null){
      this.currentLang = this.translate.currentLang;
      this.langSub = this.translate.onLangChange.subscribe(lang => {
        this.currentLang = lang.lang;
      });
    }
  }

  ngOnInit(): void {
    this.loadCheckins();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadCheckins() {
    this.dailyCheckService.getCompletedCheckIns().subscribe({
      next: (data) => {
        this.allCheckins = data;
        this.filterCheckins()
      }
    });
  }

  filterCheckins(): void {
    const { startDate, endDate } = this.checkinsForm.value;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const isValid = this.validateDatesForFiltering();

    if (isValid) {
      this.filteredCheckins = this.allCheckins.filter(check => {
        const checkDate = new Date(check.checkInDate!);
        return (start == null || checkDate >= start) && (end == null || checkDate <= end);
      });

      this.currentPage = 1;
    }
  }

  validateDatesForFiltering(): boolean {
    const { startDate, endDate } = this.checkinsForm.value;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if(startDate != null && endDate != null && startDate > endDate) {
      this.notificationService.addNotification(this.translate.instant('CHECK_IN_OVERVIEW.DATE_ERROR'), 'error');
      return false;
    }
    return true;
  }

  get paginatedCheckins(): DailyCheck[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCheckins.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.filteredCheckins.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case QuestionCategory.MENTAL: return '🧠';
      case QuestionCategory.EMOTIONAL: return '❤️';
      case QuestionCategory.PHYSICAL: return '💪';
      case QuestionCategory.SOCIAL: return '👥';
      default: return '❓';
    }
  }

  getScoreLabel(score: number | null): string {
    return score !== null ? score.toString() : 'N/A';
  }

  getAverageScore(check: DailyCheck): number {
    const scores = check.questions.map(q => q.score).filter(s => s !== null) as number[];
    if (!scores.length) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }

  getPageEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredCheckins.length ? this.filteredCheckins.length : end;
  }
}
