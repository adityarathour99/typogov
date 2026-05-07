
import { TypingStats, MistakeDetail } from '../types';

/**
 * Calculates mistakes based on strict Indian Govt. typing rules.
 * Full Mistake: Omission, Substitution, or Extra Word.
 * Half Mistake: Capitalization or Spacing.
 */
export const calculateMistakes = (sourceText: string, typedText: string): { 
  fullMistakes: number, 
  halfMistakes: number,
  details: MistakeDetail[] 
} => {
  const sourceWords = sourceText.trim().split(/\s+/);
  const typedWords = typedText.trim().split(/\s+/);
  
  let fullMistakes = 0;
  let halfMistakes = 0;
  const details: MistakeDetail[] = [];

  // Compare word by word up to the end of the source passage
  sourceWords.forEach((sourceWord, index) => {
    const typedWord = typedWords[index];

    if (typedWord === undefined) {
      // Omission counts as a full mistake
      fullMistakes++;
      details.push({ type: 'Full', reason: 'Omission', expected: sourceWord, typed: '[Missing]' });
      return;
    }

    if (sourceWord === typedWord) {
      return; // Correct
    }

    // Check for Half Mistakes
    // 1. Capitalization error
    if (sourceWord.toLowerCase() === typedWord.toLowerCase()) {
      halfMistakes++;
      details.push({ type: 'Half', reason: 'Capitalization', expected: sourceWord, typed: typedWord });
    } 
    // 2. Simple spelling (if the user requested spelling as half, but Govt usually says Full)
    // We'll treat mismatches as Full Mistakes per strict rules unless it's just Case.
    else {
      fullMistakes++;
      details.push({ type: 'Full', reason: 'Substitution', expected: sourceWord, typed: typedWord });
    }
  });

  // Extra words typed count as full mistakes
  if (typedWords.length > sourceWords.length) {
    const extraCount = typedWords.length - sourceWords.length;
    fullMistakes += extraCount;
    details.push({ type: 'Full', reason: 'Extra Words', expected: '[End of Text]', typed: `${extraCount} extra words` });
  }

  return { fullMistakes, halfMistakes, details };
};

export const calculateStats = (
  sourceText: string, 
  typedText: string, 
  timeInSeconds: number,
  totalStrokes: number
): TypingStats => {
  const { fullMistakes, halfMistakes } = calculateMistakes(sourceText, typedText);
  const totalMistakeWeight = fullMistakes + (halfMistakes * 0.5);
  
  // Dampening: If time is too short (< 3s), results are usually erratic and meaningless.
  const effectiveSeconds = Math.max(1, timeInSeconds);
  const timeInMinutes = effectiveSeconds / 60;
  
  // Standard Rule: 5 Strokes = 1 Word
  const standardWords = totalStrokes / 5;
  
  // Gross WPM Calculation
  const grossWpm = standardWords / timeInMinutes;
  
  // Net WPM Calculation (Deducting weighted mistakes)
  const netWpm = (standardWords - totalMistakeWeight) / timeInMinutes;
  
  // Accuracy
  const accuracy = standardWords > 0 
    ? ((standardWords - totalMistakeWeight) / standardWords) * 100 
    : 100;

  // Final check: Speed cannot be accurately calculated if time is tiny
  const isTimeTooShort = effectiveSeconds < 5;

  return {
    grossWpm: isTimeTooShort ? 0 : Math.max(0, Math.round(grossWpm * 100) / 100),
    netWpm: isTimeTooShort ? 0 : Math.max(0, Math.round(netWpm * 100) / 100),
    accuracy: Math.max(0, Math.round(accuracy * 100) / 100),
    totalStrokes,
    fullMistakes,
    halfMistakes,
    totalWords: Math.floor(standardWords),
    timeElapsed: effectiveSeconds
  };
};
