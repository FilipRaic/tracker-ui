import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Habit} from '../model/Habit';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {HabitService} from '../service/habit.service';
import {CustomDialogComponent} from '../custom-dialog/custom-dialog.component';
import {NotificationService} from '../service/notification.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-habit-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CustomDialogComponent, TranslatePipe],
  templateUrl: './habit-create.component.html',
  styleUrl: './habit-create.component.scss'
})
export class HabitCreateComponent {
  habits: Habit[] = [];
  habitForm: FormGroup;
  showConfirmDialog: boolean = false;
  pendingDeleteId: number | undefined = undefined;

  constructor(private readonly fb: FormBuilder, private readonly habitService: HabitService,
              private notificationService: NotificationService,
              private translate: TranslateService) {
    this.habitForm = this.fb.group({
      name: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', [Validators.required, this.isoDateValidator(), this.futureOrTodayDateValidator()]],
      notes: ['']
    });
    this.loadHabits();
  }

  private loadHabits(): void {
    this.habitService.getAllHabits().subscribe({
      next: (data) => (this.habits = data)
    });
  }

  onSubmit(): void {
    if (this.habitForm.valid) {
      const newHabit: Habit = this.habitForm.value;

      this.habitService.createHabit(newHabit).subscribe({
        next: (created) => {
          this.habits.push(created);
          this.habitForm.reset();
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  onDeleteClick(habitId: number | undefined) {
    this.pendingDeleteId = habitId;
    this.showConfirmDialog = true;
  }

  onConfirmDelete() {
    this.showConfirmDialog = false;
    this.deleteHabit(this.pendingDeleteId);
  }

  private deleteHabit(habitId: number | undefined): void {
    if (!habitId) return;

    this.habitService.deleteHabit(habitId).subscribe({
      next: () => {
        this.habits = this.habits.filter(h => h.id !== habitId)
      }
    });
  }

  private showValidationErrors() {
    const validationErrors: string[] = [];

    Object.keys(this.habitForm.controls).forEach(field => {
      const control = this.habitForm.get(field);
      if (control?.hasError('isoDate')) {
        validationErrors.push(`${field} ` + this.translate.instant('HABIT_CREATE.ERROR.DATE_ISO_FORMAT'))
      } else if (control?.hasError('dateInPast')) {
        validationErrors.push(`${field} ` + this.translate.instant('HABIT_CREATE.ERROR.PRESENT_OR_FUTURE'))
      } else if (control?.hasError('required')) {
        validationErrors.push(`${field} ` + this.translate.instant('HABIT_CREATE.ERROR.REQUIRED'))
      }
    });

    if (validationErrors.length > 0) {
      validationErrors.forEach(err => this.notificationService.addNotification(err, "error"))
    }
  }

  private isoDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!value || typeof value !== 'string') {
        return null;
      }

      return isoDateRegex.test(value) ? null : {isoDate: true};
    };
  }

  private futureOrTodayDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const inputDate = new Date(value);
      const today = new Date();

      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return inputDate >= today ? null : {dateInPast: true};
    };
  }
}
