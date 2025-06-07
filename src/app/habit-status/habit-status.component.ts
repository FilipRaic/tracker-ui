import {Component, OnInit, ViewChild} from '@angular/core';
import { HabitService } from '../service/habit.service';
import { HabitStatus } from '../model/Habit';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ErrorPopupComponent} from '../error-popup/error-popup.component';

@Component({
  selector: 'app-habit-status',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorPopupComponent],
  templateUrl: './habit-status.component.html',
  styleUrl: './habit-status.component.scss'
})
export class HabitStatusComponent implements OnInit {
  @ViewChild('errorPopup') errorPopup!: ErrorPopupComponent;
  habitsDue: HabitStatus[] = [];
  loading = true;

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.habitService.getCurrentHabitsWithStatus().subscribe({
      next : (habits) => {
        this.habitsDue = habits;
        this.loading = false;
      },
      error: (err) => this.handleApiError(err)
    });
  }

  markDone(habit: HabitStatus): void {
    if (habit.id === undefined || habit.done) return;

    this.habitService.markHabitAsDoneToday(habit.id).subscribe({
      next: () => {
        habit.done = true;
      },
      error: (err) => this.handleApiError(err)
    });
  }

  calculateTimeRemaining(dueDateStr: string): string {
    const dueDate = new Date(dueDateStr);
    const now = new Date();

    dueDate.setHours(23, 59, 59, 999);

    const diffInMs = dueDate.getTime() - now.getTime();

    if (diffInMs <= 0) return 'Due time passed';

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);

    return parts.join(' ');
  }

  private handleApiError(error: any) {
    const msg = error?.error?.message ?? 'An unknown error occurred';
    this.errorPopup.showErrors(msg);
  }
}
