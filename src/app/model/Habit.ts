export interface Habit {
  id?: number;
  name: string;
  frequency: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  notes?: string;
}

export interface HabitStatus extends Habit {
  done: boolean;
  dueDate: string;
  streak: number;
}
