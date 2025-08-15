import { useEffect, useState } from 'react';
import { Challenge } from '@/types/challenge';

interface UseChallengesParams {
  page?: number;
  pageSize?: number;
}

export function useChallenges({ page = 1, pageSize = 18 }: UseChallengesParams = {}) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/challenges?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch challenges: ${response.status}`);
      }

      const data = await response.json();
      setChallenges(data.challenges);
      setTotal(data.totalChallengeCount);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page, pageSize]);

  return {
    challenges,
    loading,
    error,
    challengeCount: total,
  };
}
