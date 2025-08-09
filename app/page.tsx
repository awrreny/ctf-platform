import { Stack, Text, Title } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
  return (
    <Stack justify="center" align="center" mx="auto" w="50%" ta={'center'}>
      <Title mt="sm">
        Welcome to{' '}
        <Text span inherit variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          u-win
        </Text>
        !
      </Title>
      <Text c="dimmed" size="md">
        Unnamed Website thats Interesting and Nice
      </Text>
      <Text mt={30} size="lg">
        A personal collection of CTF challenges - mainly in cryptography and reverse engineering.
      </Text>
      <ColorSchemeToggle />
    </Stack>
  );
}
