// contains list of ChallengeCard components
'use client';

import { SimpleGrid } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';
import { Challenge } from '@/types/challenge';

interface ChallengeListViewProps {
  challenges: Challenge[];
  onChallengeClick?: (challenge: Challenge) => void;
  solvedChallenges?: Set<number>;
}

export default function ChallengeListView({
  challenges,
  onChallengeClick,
  solvedChallenges = new Set(),
}: ChallengeListViewProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onClick={() => onChallengeClick?.(challenge)}
          isSolved={solvedChallenges.has(challenge.id)}
        />
      ))}
    </SimpleGrid>
  );
}
