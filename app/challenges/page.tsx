import { Stack, Text, Title } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';

export default function ChallengesPage() {
  return (
    <Stack justify="center" align="center" maw={1000} ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Challenges
      </Title>
      <Text mt={30} size="lg">
        Challenge List
      </Text>
      <ChallengeCard />
    </Stack>
  );
}
