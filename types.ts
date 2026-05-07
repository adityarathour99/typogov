
export enum Language {
  ENGLISH = 'English',
  HINDI_KRUTIDEV = 'Hindi (Krutidev 010)',
  HINDI_MANGAL = 'Hindi (Mangal GAIL)'
}

export enum BackspaceMode {
  NO_BACKSPACE = 'No Backspace',
  LIMITED = 'Limited Backspace',
  FULL = 'Full Backspace'
}

export interface ExamSettings {
  language: Language;
  timerMinutes: number;
  highlightEnabled: boolean;
  backspaceMode: BackspaceMode;
  showStats: boolean;
  useCustomPassage: boolean;
  customPassage: string;
}

export interface TypingStats {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalStrokes: number;
  fullMistakes: number;
  halfMistakes: number;
  totalWords: number;
  timeElapsed: number; // in seconds
}

export interface MistakeDetail {
  type: 'Full' | 'Half';
  reason: string;
  expected: string;
  typed: string;
}
