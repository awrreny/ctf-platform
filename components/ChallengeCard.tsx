'use client';

// Card.Section doesn't work in server components
// careful with this as there is no helpful error message, just nextjs acting like it doesn't exist
import { Badge, Card, Group, Stack, Text } from '@mantine/core';

export default function ChallengeCard() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section p="md" withBorder>
        <Group>
          <Text fw={500} size="sm" tt="uppercase" c="dimmed">
            Category
          </Text>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Stack gap={8}>
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg">
              Challenge Title
            </Text>
            <Badge color="red" variant="light" size="sm">
              Hard
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" lineClamp={2}>
            This text tests the line clamp feature of Mantine. It should truncate after two lines.
            Description Description Description Description Description Description Description
            Description Description Description Description Description Description Description
            Description Description Description Description Description Description Description
            Description Description Description Description Description Description Description
            Description Description Description Description
          </Text>
          <Group justify="space-between" mt="auto">
            <Group gap="xs">
              <Text size="sm" fw={500} c="blue">
                100 pts
              </Text>
              <Text size="xs" c="dimmed">
                • 2 solves
              </Text>
            </Group>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}
