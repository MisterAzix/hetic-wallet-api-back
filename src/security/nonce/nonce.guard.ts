import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../common/PrismaService';

@Injectable()
export class NonceGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const nonce = request.headers['x-nonce']; // Récupère le nonce depuis les en-têtes

    console.log('Nonce:', nonce);

    if (!nonce) {
      console.log('No nonce provided');
      return false; // Si aucun nonce n'est fourni, la requête est rejetée
    }

    // Vérifie si le nonce existe en base de données
    const validNonce = await this.prisma.nonce.findUnique({
      where: { value: nonce },
    });
    console.log('Valid nonce:', validNonce);

    if (!validNonce) {
      console.log('Nonce not found in database');
      return false; // Si le nonce n'existe pas, la requête est rejetée
    }

    // Vérifie si le nonce est récent (moins de 5 minutes)
    const nonceAge =
      new Date().getTime() - new Date(validNonce.createdAt).getTime();
    console.log('Nonce age (ms):', nonceAge);

    if (nonceAge > 5 * 60 * 1000) {
      // 5 minutes en millisecondes
      await this.prisma.nonce.delete({ where: { value: nonce } });
      console.log('Nonce too old, deleted from database');
      return false; // Si le nonce est trop vieux, la requête est rejetée
    }

    // Supprime le nonce après utilisation pour empêcher sa réutilisation
    await this.prisma.nonce.delete({ where: { value: nonce } });
    console.log('Nonce valid, deleted from database');
    return true; // Le nonce est valide, la requête est autorisée
  }
}