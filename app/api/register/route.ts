import { NextRequest, NextResponse } from 'next/server';
import argon2 from 'argon2';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.email().optional(),
  password: z.string().min(8).max(100),
});

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input format', details: result.error.issues },
      { status: 400 }
    );
  }

  const { username, email, password } = result.data;

  const alreadyExists = await prisma.user.findFirst({
    where: {
      OR: [{ username }, ...(email ? [{ email }] : [])],
    },
  });
  if (alreadyExists) {
    return NextResponse.json(
      { error: 'User with this username or email already exists' },
      { status: 409 }
    );
  }

  // not converted from hex because original bytes are not utf-8
  const pepper = process.env.PEPPER_HEX;
  if (!pepper) {
    throw new Error('Pepper env variable not found');
  }

  let hashedPassword;
  try {
    hashedPassword = await argon2.hash(password + pepper);
  } catch (err) {
    console.error('Error hashing password:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  let user;
  try {
    user = await prisma.user.create({
      data: {
        username,
        ...(email && { email }),
        passwordHash: hashedPassword,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({
    message: 'User created successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
