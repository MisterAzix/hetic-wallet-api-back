import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload-interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraire le JWT du header
      ignoreExpiration: false,
      secretOrKey: 'votre_secret_key', 
    });
  }

  // Valider le payload et le retourner
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}