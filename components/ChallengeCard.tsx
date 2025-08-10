'use client';

// Card.Section doesn't work in server components
// careful with this as there is no helpful error message, just nextjs acting like it doesn't exist
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { Challenge } from '@/types/challenge';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: () => void;
  isSolved?: boolean;
}

// ends up with default blue if not one of the keys
const difficultyColors = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'orange',
  Expert: 'red',
};

export default function ChallengeCard({
  challenge,
  onClick,
  isSolved = false,
}: ChallengeCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Card.Section p="md" withBorder>
        <Group>
          <Text fw={500} size="sm" tt="uppercase" c="dimmed">
            {challenge.category}
          </Text>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg">
              {challenge.title}
            </Text>
            <Badge color={difficultyColors[challenge.difficulty]} variant="light" size="sm">
              {challenge.difficulty}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" lineClamp={2} ta="left">
            {challenge.description}
          </Text>
          <Group justify="space-between" mt="auto">
            <Group gap="0.2rem">
              <Text size="sm" fw={500} c="blue">
                {challenge.points} pts
              </Text>
              <Text size="sm" c="dimmed">
                • {challenge.solves} solve{challenge.solves !== 1 ? 's' : ''}
              </Text>
            </Group>
            {isSolved && (
              <Badge color="green" variant="filled" size="sm">
                Solved
              </Badge>
            )}
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}
