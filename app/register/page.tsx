'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
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

interface RegisterFormData {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        if (value.length < 2) return 'Username must be at least 2 characters';
        if (value.length > 100) return 'Username must be less than 100 characters';
        if (!/^[a-zA-Z0-9_-]+$/.test(value))
          return 'Username can only contain letters, numbers, hyphens, and underscores';
        return null;
      },
      email: (value) => {
        if (!value) return null; // Email is optional
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email';
      },
      password: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (value.length > 100) return 'Password must be less than 100 characters';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          ...(values.email && { email: values.email }),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      notifications.show({
        title: 'Success!',
        message: 'Your account has been created successfully.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // Redirect to login page or dashboard
      router.push('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
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
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Register to track your points and solved challenges. Note that you can still try challenges
        and check flags without an account.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Registration Failed"
            color="red"
            mb="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              required
              {...form.getInputProps('username')}
            />

            <TextInput
              label="Email (optional)"
              placeholder="your@email.com"
              type="email"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Button type="submit" loading={loading} fullWidth mt="md">
              Create Account
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} href="/login" size="sm">
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
