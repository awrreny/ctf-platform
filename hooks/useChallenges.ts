import { useEffect, useState } from 'react';
import { Challenge } from '@/types/challenge';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/challenges');
      if (!response.ok) {
        throw new Error(`Failed to fetch challenges: ${response.status}`);
      }

      const data = await response.json();
      setChallenges(data.challenges);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
  };
}
