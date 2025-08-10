import { Stack, Text, Title } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';
import ChallengeListView from '@/components/ChallengeListView';
import { Challenge } from '@/types/challenge';

// ai-generated challenges for demonstration purposes
const challenges: Challenge[] = [
  {
    id: 'crypto-001',
    category: 'crypto',
    title: 'Caesar Cipher Basics',
    description:
      'A simple substitution cipher awaits your decryption skills. This challenge will introduce you to classical cryptography and basic frequency analysis techniques.',
    points: 50,
    difficulty: 'Easy',
    solves: 47,
  },
  {
    id: 'crypto-002',
    category: 'crypto',
    title: 'RSA Factorization',
    description:
      'Factor this small RSA modulus to recover the private key. Understanding the mathematical foundations of RSA will be key to solving this challenge.',
    points: 150,
    difficulty: 'Medium',
    solves: 23,
  },
  {
    id: 'rev-001',
    category: 'rev',
    title: 'Simple Crackme',
    description:
      'Reverse engineer this binary to find the correct password. Basic static analysis skills and understanding of assembly will help.',
    points: 100,
    difficulty: 'Easy',
    solves: 31,
  },
  {
    id: 'crypto-003',
    category: 'crypto',
    title: 'Stream Cipher Attack',
    description:
      'Exploit a weak stream cipher implementation. This challenge focuses on cryptanalysis of XOR-based encryption schemes.',
    points: 300,
    difficulty: 'Hard',
    solves: 8,
  },
  {
    id: 'rev-002',
    category: 'rev',
    title: 'Obfuscated Binary',
    description:
      'Navigate through anti-debugging and obfuscation techniques. Advanced reverse engineering skills and dynamic analysis will be required.',
    points: 400,
    difficulty: 'Expert',
    solves: 3,
  },
];

export default function ChallengesPage() {
  return (
    <Stack justify="center" align="center" maw="100rem" ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Challenges
      </Title>
      <Text mt="xl" size="lg">
        Challenge List
      </Text>
      <ChallengeListView challenges={challenges} />
    </Stack>
  );
}
