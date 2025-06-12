export enum QuestionCategory {
  MENTAL = 'MENTAL',
  EMOTIONAL = 'EMOTIONAL',
  PHYSICAL = 'PHYSICAL',
  SOCIAL = 'SOCIAL'
}

export interface DailyQuestion {
  id: number;
  category: QuestionCategory;
  content: string;
  contentDe: string;
  contentHr: string;
  score: number | null;
}

export interface DailyCheck {
  id?: number;
  questions: DailyQuestion[];
  completed: boolean;
  userFirstName: string;
}

export interface DailyCheckSubmit {
  id: number;
  questions: DailyQuestion[];
}
