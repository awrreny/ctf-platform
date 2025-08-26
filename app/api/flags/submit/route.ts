import { NextRequest, NextResponse } from 'next/server';
import crypto, { timingSafeEqual } from 'crypto';
import { z } from 'zod';
import { auth } from '@/auth';
import { MAX_FLAG_LENGTH } from '@/config/constants';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  flag: z.string().min(1).max(MAX_FLAG_LENGTH),
  challengeId: z.int().positive(),
});

// TODO research caching

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input format', details: result.error.issues },
      { status: 400 }
    );
  }

  const { flag, challengeId } = result.data;

  // Get current session to check if user is logged in
  const session = await auth();
  let userId: number | null = null;

  if (session?.user?.name) {
    // Get user ID from username
    try {
      const user = await prisma.user.findUnique({
        where: { username: session.user.name },
        select: { id: true },
      });
      userId = user?.id ?? null;
    } catch (error) {
      console.error('Error fetching user:', error);
      // Continue without user ID if there's an error
    }
  }

  const flagHash = crypto.createHash('sha256').update(flag).digest('hex');

  let flagHashStorage;
  try {
    flagHashStorage = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { flagHash: true },
    });
  } catch (error) {
    console.error('Error fetching stored flag hash:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  if (!flagHashStorage) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const storedFlagHash = Buffer.from(flagHashStorage.flagHash, 'hex');
  const providedFlagHash = Buffer.from(flagHash, 'hex');

  // no length check needed as hashes are always the same length
  const isValid = timingSafeEqual(providedFlagHash, storedFlagHash);

  if (userId) {
    try {
      // Check if user already has a correct submission for this challenge
      if (isValid) {
        const existingCorrectSubmission = await prisma.submission.findFirst({
          where: {
            userId,
            challengeId,
            isCorrect: true,
          },
        });

        if (existingCorrectSubmission) {
          // User already solved this challenge, don't create duplicate
          return NextResponse.json({
            isCorrect: true,
            message: 'Challenge already solved',
          });
        }
      }

      // store plaintext flags if explicitly enabled
      const shouldStoreFlags = (process.env.STORE_SUBMISSION_FLAGS || 'false') === 'true';

      await prisma.submission.create({
        data: {
          userId,
          challengeId,
          flag: shouldStoreFlags ? flag : null, // Only store flag if env var is enabled
          isCorrect: isValid,
        },
      });
    } catch (error) {
      console.error('Error saving submission:', error);
      // still return flag validation result even if saving fails
    }
  }

  return NextResponse.json({ isCorrect: isValid });
}
