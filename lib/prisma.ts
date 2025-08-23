import { PrismaClient } from '@/generated/prisma';

// Use singleton pattern in development to prevent multiple instances
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#recommended-solution
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
