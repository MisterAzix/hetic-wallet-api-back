import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
/**
   * Génère un nonce aléatoire et le stocke en base de données avec un timestamp.
   * @returns {Promise<string>} Le nonce généré.
   */
export class NonceService {
  async generateNonce(): Promise<string> {
    const nonce = Math.random().toString(36).substring(2, 15); 
    const timestamp = new Date();
    await prisma.nonce.create({ data: { value: nonce, createdAt: timestamp } });
    return nonce;
  }
}
