import { Stack, Text, Title } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
  return (
    <Stack justify="center" align="center" maw={1000} ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        About
      </Title>
      <Text mt={30} size="lg">
        Solve puzzles and learn new techniques in cryptography and reverse engineering.
      </Text>
    </Stack>
  );
}
