import argon2 from 'argon2';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { PrismaClient } from '@/generated/prisma';

// use singleton if in development
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#recommended-solution
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const authSchema = z.object({
  username: z.string().min(2).max(100), // Can be username or email
  password: z.string().min(8).max(100),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentialsUnsafe) => {
        const result = authSchema.safeParse(credentialsUnsafe);
        if (!result.success) {
          return null;
        }
        const { username: identifier, password } = result.data;

        try {
          // Find user in database by username or email
          const user = await prisma.user.findFirst({
            where: {
              OR: [{ username: identifier }, { email: identifier }],
            },
          });

          if (!user) {
            return null;
          }

          // not converted from hex because original bytes are not utf-8
          const pepper = process.env.PEPPER_HEX;
          if (!pepper) {
            throw new Error('Pepper env variable not found');
          }

          // Verify password
          const isMatch = await argon2.verify(user.passwordHash, password + pepper);
          if (!isMatch) {
            return null;
          }

          // Return user object (NextAuth will handle the session)
          return {
            // id: user.id.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Error verifying password:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
