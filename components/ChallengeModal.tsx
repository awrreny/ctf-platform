'use client';

import { useState } from 'react';
import { IconDownload, IconExternalLink } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { CHALLENGE_ATTACHMENT_SITE } from '@/config/constants';
import { useFlagValidation } from '@/hooks/useFlagValidation';
import { Challenge } from '@/types/challenge';

interface ChallengeModalProps {
  challenge: Challenge | null;
  opened: boolean;
  onClose: () => void;
  isSolved?: boolean;
  onSolve?: (challengeId: number, flag: string) => void;
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
  const { isSubmitting, submitMessage, validateFlag, clearMessage } = useFlagValidation();

  const handleSubmit = async () => {
    if (!challenge || !flag.trim()) return;

    const isCorrect = await validateFlag(challenge, flag, onSolve);
    if (isCorrect) {
      setFlag('');
    }
  };

  const handleClose = () => {
    setFlag('');
    clearMessage();
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

        <Text size="md" style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {challenge.description}
        </Text>

        {challenge.attachments && challenge.attachments.length > 0 && (
          <>
            <Divider />
            <Stack gap="xs">
              {challenge.attachments.map((attachment) => (
                <Card key={attachment} p="sm">
                  <Group justify="space-between" align="center">
                    <Group>
                      <IconDownload size={16} />
                      <Text size="sm" c="dimmed">
                        {attachment.split('/').pop()}
                      </Text>
                    </Group>
                    <Button
                      variant="light"
                      color="blue"
                      size="xs"
                      component="a"
                      href={`${CHALLENGE_ATTACHMENT_SITE}${attachment}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      rightSection={<IconExternalLink size={12} />}
                    >
                      Download
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          </>
        )}

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
