'use client';

import { useState } from 'react';
import { Alert, Loader, Pagination, Stack, Title } from '@mantine/core';
import ChallengeListView from '@/components/ChallengeListView';
import ChallengeModal from '@/components/ChallengeModal';
import { useChallenges } from '@/hooks/useChallenges';
import { Challenge } from '@/types/challenge';

export default function ChallengesPage() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(18);
  const { challenges, loading, error, challengeCount, markChallengeAsSolved } = useChallenges({
    page,
    pageSize,
  });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const pageCount = Math.ceil(challengeCount / pageSize);

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
    setSelectedChallenge(null);
  };

  return (
    <Stack justify="center" align="center" maw="100rem" ta={'center'} mx="auto" px="xl">
      <Title mt="sm" order={1}>
        Challenges
      </Title>

      {pageCount > 1 && <Pagination total={pageCount} value={page} onChange={setPage} />}

      {loading && <Loader size="lg" />}

      {error && (
        <Alert variant="light" color="red" title="Error loading challenges">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <ChallengeListView challenges={challenges} onChallengeClick={handleChallengeClick} />
      )}

      <ChallengeModal
        challenge={selectedChallenge}
        opened={modalOpened}
        onClose={handleModalClose}
        isSolved={selectedChallenge?.solved ?? false}
        onSolve={markChallengeAsSolved}
      />
    </Stack>
  );
}
