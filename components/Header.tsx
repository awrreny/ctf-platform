import Link from 'next/link';
import { IconUser } from '@tabler/icons-react';
import { Button, Divider, Group, NavLink } from '@mantine/core';
import { auth } from '@/auth';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Challenges', href: '/challenges' },
];

export default async function Header() {
  const session = await auth();

  // if user is logged in, show IconUser with username, otherwise 'log in'
  // in both cases, button should link to /login
  // later should link to profile page with stats etc. TODO
  const accountButton = (
    <Button component={Link} href="/login" variant="subtle" radius={0} size="lg" c="dimmed">
      {session ? (
        <Group>
          {session.user?.name ?? 'Unknown User'} <IconUser size={16} />
        </Group>
      ) : (
        'Log in'
      )}
    </Button>
  );

  return (
    <>
      <Group justify="space-between" align="center" p={0}>
        <Group gap={0}>
          {links.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              variant="subtle"
              radius={0}
              size="lg"
              c="dimmed"
            >
              {link.label}
            </Button>
          ))}
        </Group>
        {accountButton}
      </Group>
      <Divider mb="sm" />
      {/* TODO add alternate menu for mobile view */}
    </>
  );
}
