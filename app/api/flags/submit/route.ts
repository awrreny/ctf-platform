import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { flag, challengeId } = await req.json();

  const flagHash = crypto.createHash('sha256').update(flag).digest('hex');

  const storedFlagHash = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { flagHash: true },
  });

  if (!storedFlagHash) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const isValid = flagHash === storedFlagHash.flagHash;
  return NextResponse.json({ isCorrect: isValid });
}
