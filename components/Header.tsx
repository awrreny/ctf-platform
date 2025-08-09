import Link from 'next/link';
import { Button, Divider, Group, NavLink } from '@mantine/core';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  return (
    <>
      <Group justify="space-between" align="center" p="md">
        <Group>
          {links.map((link) => (
            <Button key={link.href} component={Link} href={link.href}>
              {link.label}
            </Button>
          ))}
        </Group>
        <Button disabled>Login</Button>
      </Group>
      <Divider mb="sm" />
      {/* TODO add alternate menu for mobile view */}
    </>
  );
}
