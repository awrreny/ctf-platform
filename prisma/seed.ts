import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

function hashFlag(flag: string): string {
  return crypto.createHash('sha256').update(flag).digest('hex');
}

async function main() {
  const dataFilePath = path.join(__dirname, 'chal-seed-data.json');
  let challenges;

  // Check if chal-seed-data.json exists
  if (fs.existsSync(dataFilePath)) {
    console.log('Found chal-seed-data.json, loading challenges from file...');
    try {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      const challengesFromFile = JSON.parse(fileContent);

      // Transform the data: hash flags
      challenges = challengesFromFile.map((challenge: any) => ({
        title: challenge.title,
        category: challenge.category,
        difficulty: challenge.difficulty,
        description: challenge.description,
        points: challenge.points,
        solves: challenge.solves,
        flagHash: hashFlag(challenge.flag),
      }));
    } catch (error) {
      console.error('Error reading chal-seed-data.json:', error);
      process.exit(1);
    }
  } else {
    console.log('chal-seed-data.json not found, using hardcoded challenge...');
    // Hardcoded example challenge
    challenges = [
      {
        title: 'Example Challenge',
        category: 'misc',
        difficulty: 'Easy',
        description:
          'Placeholder challenge. The flag is flag{example_flag_12345}. Place challenges in chal-seed-data.json as a json array. (search this text in prisma/seed.ts for example)',
        points: 1,
        solves: 1337,
        flagHash: hashFlag('flag{example_flag_12345}'),
      },
    ];
  }

  // Clear existing challenges
  console.log('Clearing existing challenges...');
  await prisma.challenge.deleteMany();

  // Seed the database
  console.log(`Seeding ${challenges.length} challenge(s)...`);
  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
