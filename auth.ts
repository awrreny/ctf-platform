import argon2 from 'argon2';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const authSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentialsUnsafe) => {
        const result = authSchema.safeParse(credentialsUnsafe);
        if (!result.success) {
          return null;
        }
        const credentials = result.data;

        try {
          const hashedPassword = await argon2.hash(credentials.password);
        } catch (error) {
          console.error('Error hashing password:', error);
          return null;
        }

        // later get hash from db
        const storedHash = await argon2.hash('test_password');

        try {
          const isMatch = await argon2.verify(storedHash, credentials.password);
          if (!isMatch) {
            return null;
          }
        } catch (error) {
          console.error('Error verifying password:', error);
          return null;
        }

        // later get user from db
        return { name: 'Test User' };
      },
    }),
  ],
});
