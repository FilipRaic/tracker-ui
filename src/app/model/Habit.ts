export interface Habit {
  id?: number;
  name: string;
  frequency: 'day' | 'week' | 'month' | 'year';
  startDate: string; // ISO format date string (e.g., '2025-05-26')
  notes?: string;
}
