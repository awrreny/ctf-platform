import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Header from '@/components/Header';
import { theme } from '../theme';

export const metadata = {
  title: 'u-winCTF',
  description: 'ctf website by awr',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <Header />
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
