import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuration de Passport
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Utilisation de la variable d'environnement
        signOptions: { expiresIn: '1h' }, // Expiration du JWT
      }),
    }),
  ],
  providers: [JwtAuthService, JwtStrategy], // Services et stratégies
  exports: [NestJwtModule, PassportModule, JwtAuthService], 
})
export class AuthModule {}
