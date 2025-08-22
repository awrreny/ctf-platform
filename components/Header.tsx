import Link from 'next/link';
import { Button, Divider, Group, NavLink } from '@mantine/core';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Challenges', href: '/challenges' },
];

export default function Header() {
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
        <Button component={Link} href="/login" variant="subtle" radius={0} size="lg" c="dimmed">
          Log in
        </Button>
      </Group>
      <Divider mb="sm" />
      {/* TODO add alternate menu for mobile view */}
    </>
  );
}
