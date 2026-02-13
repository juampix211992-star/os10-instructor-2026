
export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  EXAM = 'EXAM',
  TRUE_FALSE = 'TRUE_FALSE',
  LAWS = 'LAWS',
  VISUAL = 'VISUAL',
  RESULTS = 'RESULTS'
}

export enum Difficulty {
  LOW = 'Baja',
  MEDIUM = 'Media',
  HIGH = 'Alta'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  topic: string;
  score: number;
  total: number;
  details: {
    question: string;
    category: string;
    isCorrect: boolean;
  }[];
}

export interface CategoryStat {
  category: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface StudyMaterial {
  title: string;
  detail: string;
}

export interface StudyContent {
  id: string;
  title: string;
  explanation: string;
  detailedContent: string;
  materials: StudyMaterial[];
  examples: { case: string; action: string }[];
  icon: string;
}
