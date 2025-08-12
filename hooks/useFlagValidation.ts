import { useState } from 'react';
import { Challenge } from '@/types/challenge';

interface SubmitMessage {
  type: 'success' | 'error';
  text: string;
}

export function useFlagValidation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  const validateFlag = async (
    challenge: Challenge,
    flag: string,
    onSolve?: (challengeId: number, flag: string) => void
  ) => {
    if (!challenge || !flag.trim()) return false;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/flags/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag, challengeId: challenge.id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { isCorrect: isCorrect } = await response.json();

      if (isCorrect) {
        setSubmitMessage({ type: 'success', text: 'Correct! Challenge solved!' });
        onSolve?.(challenge.id, flag);
        return true;
      } else {
        setSubmitMessage({ type: 'error', text: 'Incorrect flag. Try again!' });
        return false;
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessage = () => setSubmitMessage(null);

  return {
    isSubmitting,
    submitMessage,
    validateFlag,
    clearMessage,
  };
}
