import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { MAX_CHALLENGE_PAGE_SIZE } from '@/config/constants';
import { prisma } from '@/lib/prisma';
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

export async function GET(req: NextRequest) {
  // AUTHENTICATION -----------------------------------------------------------------------
  const session = await auth();
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;
  // --------------------------------------------------------------------------------------

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
        attachments: { select: { url: true } },
      },
      orderBy: {
        points: 'asc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Get challenge IDs for this page to calculate solves efficiently
    const challengeIds = rawChallenges.map((challenge) => challenge.id);

    // Count correct submissions per challenge assuming no duplicate correct solves by the same user
    const solveCountsRaw = await prisma.submission.groupBy({
      by: ['challengeId'],
      where: {
        challengeId: { in: challengeIds },
        isCorrect: true,
      },
      _count: {
        id: true,
      },
    });

    const solveCountMap = new Map<number, number>();
    for (const item of solveCountsRaw) {
      solveCountMap.set(item.challengeId, item._count.id);
    }

    // Get solved challenges for the authenticated user
    let solvedChallengeIds: Set<number> = new Set();
    if (currentUserId) {
      const solvedSubmissions = await prisma.submission.findMany({
        where: {
          userId: currentUserId,
          isCorrect: true,
        },
        select: {
          challengeId: true,
        },
        distinct: ['challengeId'],
      });
      solvedChallengeIds = new Set(solvedSubmissions.map((s) => s.challengeId));
    }
    // ---------------------------------------------------------------------------------------

    // Map raw results to Challenge type, ensuring difficulty is cast correctly
    const challenges: Challenge[] = rawChallenges.map((challenge) => ({
      ...challenge,
      difficulty: challenge.difficulty as Challenge['difficulty'],
      attachments: challenge.attachments.map((attachment) => attachment.url),
      solves: solveCountMap.get(challenge.id) || 0,
      solved: currentUserId ? solvedChallengeIds.has(challenge.id) : false,
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
