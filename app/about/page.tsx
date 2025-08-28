'use client';

import { Anchor, Divider, List, Stack, Text, Title } from '@mantine/core';

export default function AboutPage() {
  return (
    <Stack justify="center" align="center" maw={1000} ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        About
      </Title>

      <Text mt={30} size="lg">
        This website hosts some of the{' '}
        <Anchor
          href="https://en.wikipedia.org/wiki/Capture_the_flag_(cybersecurity)"
          target="_blank"
          rel="noopener noreferrer"
        >
          CTF
        </Anchor>{' '}
        challenges that I've made. Most of the challenges focus on cryptography, but some may cover
        other areas of cybersecurity as well.
      </Text>

      <Divider mt="xl" mb="lg" />

      <Title order={2} size="h3" mt="lg">
        New to CTFs?
      </Title>

      <Text size="md" mt="sm">
        CTFs (Capture The Flags) are cybersecurity competitions where you can solve puzzles -
        usually in the style of exploiting a vulnerable service - to find hidden "flags". Here are
        some resources to learn more:
      </Text>

      <List ta="left" mt="md" spacing="xs" size="sm">
        <List.Item>
          <Text size="sm">
            <Anchor
              href="https://en.wikipedia.org/wiki/Capture_the_flag_(cybersecurity)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia - Capture the Flag
            </Anchor>
          </Text>
        </List.Item>
        <List.Item>
          <Text size="sm">
            <Anchor
              href="https://www.youtube.com/watch?v=8ev9ZX9J45A"
              target="_blank"
              rel="noopener noreferrer"
            >
              LiveOverflow - What are CTFs? (YouTube)
            </Anchor>
          </Text>
        </List.Item>
      </List>

      <Divider mt="xl" mb="lg" />

      <Title order={2} size="h3">
        Helpful Tools & Resources
      </Title>

      <List ta="left" mt="md" spacing="xs" size="sm">
        <List.Item>
          <Anchor
            href="https://github.com/HackerDucky1337/ctf_resources"
            target="_blank"
            rel="noopener noreferrer"
          >
            ctf_resources
          </Anchor>{' '}
          - A comprehensive list of resources and tools
        </List.Item>
        <List.Item>
          <Anchor href="https://picoctf.org/" target="_blank" rel="noopener noreferrer">
            picoCTF
          </Anchor>{' '}
          - Beginner-friendly CTF platform with educational content
        </List.Item>
        <List.Item>
          <Anchor href="https://ctftime.org/" target="_blank" rel="noopener noreferrer">
            CTFtime
          </Anchor>{' '}
          - A platform for tracking CTF competitions
        </List.Item>
      </List>
      {/* if uncommenting, replace with next Link */}
      {/* <Text mt="xl">
        <Anchor href="/challenges" target="_blank" rel="noopener noreferrer">
          View challenges
        </Anchor>
      </Text> */}
    </Stack>
  );
}
