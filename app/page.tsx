import { Stack, Text, Title } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
  return (
    <Stack justify="center" align="center" maw={1000} ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Welcome to{' '}
        <Text span inherit variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          u-win
        </Text>
        !
      </Title>
      <Text c="dimmed" size="md" mt={-15}>
        Unnamed Website thats Interesting and Nice
      </Text>
      <Text mt={30} size="lg">
        A personal collection of CTF challenges - mainly in cryptography.
      </Text>
      <ColorSchemeToggle />
    </Stack>
  );
}
