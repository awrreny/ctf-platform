'use client';

import { useEffect, useState } from 'react';
import { Alert, Loader, Stack, Text, Title } from '@mantine/core';
import ChallengeCard from '@/components/ChallengeCard';
import ChallengeListView from '@/components/ChallengeListView';
import ChallengeModal from '@/components/ChallengeModal';
import { Challenge } from '@/types/challenge';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<number>>(new Set());

  // Load solved challenges from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('solvedChallenges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSolvedChallenges(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse solved challenges from localStorage:', error);
      }
    }
  }, []);

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/challenges');

        if (!response.ok) {
          throw new Error(`Failed to fetch challenges: ${response.status}`);
        }

        const data = await response.json();
        setChallenges(data.challenges);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Save solved challenges to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('solvedChallenges', JSON.stringify(Array.from(solvedChallenges)));
  }, [solvedChallenges]);

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
    setSelectedChallenge(null);
  };

  const handleChallengeSolve = (challengeId: number, flag: string) => {
    setSolvedChallenges((prev) => new Set(prev).add(challengeId));
  };

  return (
    <Stack justify="center" align="center" maw="100rem" ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Challenges
      </Title>
      <Text mt="xl" size="lg">
        Challenge List
      </Text>

      {loading && <Loader size="lg" />}

      {error && (
        <Alert variant="light" color="red" title="Error loading challenges">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <ChallengeListView
          challenges={challenges}
          onChallengeClick={handleChallengeClick}
          solvedChallenges={solvedChallenges}
        />
      )}

      <ChallengeModal
        challenge={selectedChallenge}
        opened={modalOpened}
        onClose={handleModalClose}
        isSolved={selectedChallenge ? solvedChallenges.has(selectedChallenge.id) : false}
        onSolve={handleChallengeSolve}
      />
    </Stack>
  );
}
