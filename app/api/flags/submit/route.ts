import { NextRequest, NextResponse } from 'next/server';
import crypto, { timingSafeEqual } from 'crypto';
import { z } from 'zod';
import { MAX_FLAG_LENGTH } from '@/config/constants';
import { PrismaClient } from '@/generated/prisma';

const schema = z.object({
  flag: z.string().min(1).max(MAX_FLAG_LENGTH),
  challengeId: z.int().positive(),
});

// use singleton if in development
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#recommended-solution
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

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
    return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
  }

  const { flag, challengeId } = result.data;

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
  return NextResponse.json({ isCorrect: isValid });
}
