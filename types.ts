
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  BUILDER = 'BUILDER',
  STATS = 'STATS',
  PROFILE = 'PROFILE',
  WORKOUT_PLAYER = 'WORKOUT_PLAYER',
  ONBOARDING = 'ONBOARDING'
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  note?: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  durationMinutes?: number;
  createdAt: Date;
}

export interface UserProfile {
  name: string;
  goal: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
}
