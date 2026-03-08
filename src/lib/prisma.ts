import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if we're in build phase
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

// Create a mock prisma client for build phase
const mockPrisma = {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => ({}),
    update: async () => ({}),
  },
  account: {
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    deleteMany: async () => ({}),
  },
  metric: {
    findFirst: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    deleteMany: async () => ({}),
  },
  $connect: async () => {},
  $disconnect: async () => {},
};

export const prisma = isBuildPhase
  ? (mockPrisma as unknown as PrismaClient)
  : globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production" && !isBuildPhase) {
  globalForPrisma.prisma = prisma as PrismaClient;
}
