import { Stack, Text, Title } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';
import { Challenge } from '@/types/challenge';

const mockChallenge: Challenge = {
  id: '1',
  category: 'crypto',
  title: 'RSA basics',
  description: 'A simple RSA challenge.',
  points: 50,
  difficulty: 'Easy',
  solves: 1,
};

export default function ChallengesPage() {
  return (
    <Stack justify="center" align="center" maw={1000} ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Challenges
      </Title>
      <Text mt="xl" size="lg">
        Challenge List
      </Text>
      <ChallengeCard challenge={mockChallenge} />
    </Stack>
  );
}
