// nonce.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NonceGuard implements CanActivate {
  /**
   * Valide le nonce envoyé dans les en-têtes de la requête.
   * @param {ExecutionContext} context - Le contexte d'exécution de la requête.
   * @returns {Promise<boolean>} True si le nonce est valide, sinon False.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const nonce = request.headers['x-nonce']; // Récupère le nonce depuis les en-têtes

    if (!nonce) return false; // Si aucun nonce n'est fourni, la requête est rejetée

    // Vérifie si le nonce existe en base de données
    const validNonce = await prisma.nonce.findUnique({ where: { value: nonce } });
    if (!validNonce) return false; // Si le nonce n'existe pas, la requête est rejetée

    // Vérifie si le nonce est récent (moins de 5 minutes)
    const nonceAge = new Date().getTime() - new Date(validNonce.createdAt).getTime();
    if (nonceAge > 5 * 60 * 1000) { // 5 minutes en millisecondes
      await prisma.nonce.delete({ where: { value: nonce } });
      return false; // Si le nonce est trop vieux, la requête est rejetée
    }

    // Supprime le nonce après utilisation pour empêcher sa réutilisation
    await prisma.nonce.delete({ where: { value: nonce } });
    return true; // Le nonce est valide, la requête est autorisée
  }
}