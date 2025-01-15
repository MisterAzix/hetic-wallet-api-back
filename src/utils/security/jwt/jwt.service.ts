import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt.payload-interface';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

    /**
         * Générer un JWT pour une action spécifique
         * @param payload - Les données à inclure dans le JWT (doit implémenter JWTPayload)
         * @returns Le token JWT généré
         * 
         * Exemple d'utilisation :
         * 
         * const payload: JWTPayload = { sub: 'userId', action: 'sign_transaction' };
         * const token = this.jwtAuthService.generateActionToken(payload);
         * console.log('Generated Token:', token);
    */
    generateActionToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload);
  }

   /**
     * Valider un JWT
     * @param token - Le token JWT à valider
     * @returns Le payload décodé si le token est valide
     * 
     * Exemple d'utilisation :
     * 
     * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
     * const payload = this.jwtAuthService.validateToken(token);
     * console.log('Decoded Payload:', payload);
   */
  validateToken(token: string): JWTPayload {
    return this.jwtService.verify(token);
  }
}
