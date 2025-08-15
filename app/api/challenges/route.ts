import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { Challenge } from '@/types/challenge';

// use singleton if in development
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#recommended-solution
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET() {
  try {
    // Fetch challenges from database
    // Note: We exclude flagHash for security - only return public fields
    const rawChallenges = await prisma.challenge.findMany({
      select: {
        id: true,
        category: true,
        title: true,
        difficulty: true,
        description: true,
        points: true,
        solves: true,
        attachments: { select: { url: true } },
        // flagHash: false - explicitly exclude sensitive data
      },
      // TODO replace with user-defined filters when ready
      // also add pagination later
      orderBy: {
        points: 'asc',
      },
    });

    // Map raw results to Challenge type, ensuring difficulty is cast correctly
    const challenges: Challenge[] = rawChallenges.map((challenge) => ({
      ...challenge,
      difficulty: challenge.difficulty as Challenge['difficulty'],
      attachments: challenge.attachments.map((attachment) => attachment.url),
    }));

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// TODO auth and rate limiting middleware
// TODO: Add input validation for query parameters (filtering, pagination)
