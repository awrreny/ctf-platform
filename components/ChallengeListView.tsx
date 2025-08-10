// contains list of ChallengeCard components
'use client';

import { SimpleGrid } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';
import { Challenge } from '@/types/challenge';

interface ChallengeListViewProps {
  challenges: Challenge[];
}

export default function ChallengeListView({ challenges }: ChallengeListViewProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </SimpleGrid>
  );
}
