'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import {
  Alert,
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<LoginFormData>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 2 ? 'Username or email is required' : null),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error('Invalid username or password');
      }

      if (result?.ok) {
        notifications.show({
          title: 'Success!',
          message: 'You have been logged in successfully.',
          color: 'green',
        });
        // TODO use callback URLs with sanitization and validation, and make it work for /register as well
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Log In
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Welcome back
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Login Failed" color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username or Email"
              placeholder="Enter your username or email"
              required
              {...form.getInputProps('username')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <Button type="submit" loading={loading} fullWidth mt="md">
              Log In
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          Don't have an account?{' '}
          <Anchor component={Link} href="/register" size="sm">
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
