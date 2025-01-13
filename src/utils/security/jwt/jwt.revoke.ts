import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const revokedTokens = new Set<string>();

export function revokeToken(token: string) {
  revokedTokens.add(token);
}

export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}

export class TokenBlacklistService {
    async revokeToken(token: string): Promise<void> {
      await prisma.revokedToken.create({ data: { token } });
    }
}