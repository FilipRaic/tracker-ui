import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DailyCheckService} from '../service/daily-check.service';
import {DailyCheck, DailyQuestion} from '../model/DailyCheck';
import {NotificationService} from '../service/notification.service';
import {Observable, tap} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-daily-check',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './daily-check.component.html',
  styleUrl: './daily-check.component.scss'
})
export class DailyCheckComponent implements OnInit {
  dailyCheck$ = new Observable<DailyCheck | null>();
  currentQuestionIndex = 0;
  currentQuestion: DailyQuestion | null = null;
  currentLang = 'en';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dailyCheckService: DailyCheckService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const uuid = params['uuid'];
      this.loadDailyCheck(uuid);
      if(this.translate.currentLang != null){
        this.currentLang = this.translate.currentLang;
      }
    });
  }

  loadDailyCheck(uuid: string): void {
    this.dailyCheck$ = this.dailyCheckService.getCheckInByUuid(uuid)
      .pipe(
        tap((dailyCheck) => this.currentQuestion = dailyCheck?.questions[0])
      );
  }

  isQuestionAnswered(index: number, dailyCheck: DailyCheck): boolean {
    if (!dailyCheck.questions[index]) {
      return false;
    }

    return dailyCheck.questions[index].score !== null;
  }

  setScore(question: DailyQuestion, score: number): void {
    if (!question || !score) {
      return;
    }

    question.score = score;
  }

  nextQuestion(dailyCheck: DailyCheck): void {
    if (this.currentQuestionIndex < dailyCheck.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = dailyCheck.questions[this.currentQuestionIndex];
    } else {
      this.submitDailyCheck(dailyCheck);
    }
  }

  previousQuestion(dailyCheck: DailyCheck): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = dailyCheck.questions[this.currentQuestionIndex];
    }
  }

  canGoNext(): boolean {
    return this.currentQuestion?.score !== null;
  }

  submitDailyCheck(dailyCheck: DailyCheck): void {
    if (!dailyCheck) {
      return;
    }

    const allQuestionsAnswered = dailyCheck.questions.every(q => q.score !== null);
    if (!allQuestionsAnswered) {
      this.notificationService.addNotification(this.translate.instant('DAILY_CHECK.ERROR_QUESTIONS_NOT_FILLED'), 'error');
      return;
    }

    const dailyCheckSubmit = {
      id: dailyCheck.id!,
      questions: dailyCheck.questions
    };

    this.dailyCheckService.submitDailyCheck(dailyCheckSubmit).subscribe({
      next: () => {
        this.notificationService.addNotification(this.translate.instant('DAILY_CHECK.CHECK_SUBMITTED'), 'success')
        this.router.navigate(['/']).then();
      }
    });
  }
}
