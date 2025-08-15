import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MAX_CHALLENGE_PAGE_SIZE } from '@/config/constants';
import { PrismaClient } from '@/generated/prisma';
import { Challenge } from '@/types/challenge';

const schema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_CHALLENGE_PAGE_SIZE, {
      message: `Page size must be at most ${MAX_CHALLENGE_PAGE_SIZE}`,
    })
    .default(18),
});

// use singleton if in development
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#recommended-solution
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET(req: NextRequest) {
  // INPUT VALIDATION ------------------------------------------------------------------------
  const result = schema.safeParse({
    page: parseInt(req.nextUrl.searchParams.get('page') || '1', 10),
    pageSize: parseInt(req.nextUrl.searchParams.get('pageSize') || '18', 10),
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues.map((issue) => issue.message) },
      { status: 400 }
    );
  }

  const { page, pageSize } = result.data;
  // -----------------------------------------------------------------------------------------

  try {
    // TODO filter+order
    // DB FETCH ------------------------------------------------------------------------------
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
      },
      orderBy: {
        points: 'asc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    // ---------------------------------------------------------------------------------------

    // Map raw results to Challenge type, ensuring difficulty is cast correctly
    const challenges: Challenge[] = rawChallenges.map((challenge) => ({
      ...challenge,
      difficulty: challenge.difficulty as Challenge['difficulty'],
      attachments: challenge.attachments.map((attachment) => attachment.url),
    }));

    // including all pages, but not including filtered out challenges
    const totalChallengeCount = await prisma.challenge.count();

    return NextResponse.json({ challenges, totalChallengeCount });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// TODO auth and rate limiting middleware
// TODO: Add input validation for query parameters (filtering, pagination)
