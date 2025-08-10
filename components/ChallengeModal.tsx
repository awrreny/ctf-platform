'use client';

import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Challenge } from '@/types/challenge';

interface ChallengeModalProps {
  challenge: Challenge | null;
  opened: boolean;
  onClose: () => void;
  isSolved?: boolean;
  onSolve?: (challengeId: string, flag: string) => void;
}

// ends up with default blue if not one of the keys
const difficultyColors = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'orange',
  Expert: 'red',
};

export default function ChallengeModal({
  challenge,
  opened,
  onClose,
  isSolved = false,
  onSolve,
}: ChallengeModalProps) {
  const [flag, setFlag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!challenge || !flag.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Simulate flag validation - in real implementation, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, consider flags starting with "flag{" as correct
      const isCorrect = flag.toLowerCase().startsWith('flag{');

      if (isCorrect) {
        setSubmitMessage({ type: 'success', text: 'Correct! Challenge solved!' });
        onSolve?.(challenge.id, flag);
        setFlag('');
      } else {
        setSubmitMessage({ type: 'error', text: 'Incorrect flag. Try again!' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFlag('');
    setSubmitMessage(null);
    onClose();
  };

  if (!challenge) return null;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group align="baseline">
          <Text fw={600} size="lg">
            {challenge.title}
          </Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group align="center" gap="0.2rem">
            <Text size="sm" c="dimmed">
              {challenge.category} •
            </Text>
            <Text size="sm" c="blue">
              {challenge.points} points
            </Text>
            <Text size="sm" c="dimmed">
              • {challenge.solves} solve{challenge.solves !== 1 ? 's' : ''}
            </Text>
          </Group>
          <Group align="center">
            <Badge color={difficultyColors[challenge.difficulty]} variant="light">
              {challenge.difficulty}
            </Badge>
          </Group>
        </Group>

        <Divider />

        <Text size="md" style={{ lineHeight: 1.6 }}>
          {challenge.description}
        </Text>

        {isSolved ? (
          <Alert color="green" title="Challenge Solved!">
            You have already solved this challenge.
          </Alert>
        ) : (
          <>
            <Divider />

            <Stack gap="sm">
              <TextInput
                placeholder="flag{...}"
                value={flag}
                onChange={(event) => setFlag(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                disabled={isSubmitting}
              />

              {submitMessage && (
                <Alert color={submitMessage.type === 'success' ? 'green' : 'red'}>
                  {submitMessage.text}
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!flag.trim()}
                color="blue"
              >
                Submit Flag
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Modal>
  );
}
