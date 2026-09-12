import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

let client: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for PostgreSQL persistence");
  }

  client ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  return client;
}

export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect();
    client = undefined;
  }
}
