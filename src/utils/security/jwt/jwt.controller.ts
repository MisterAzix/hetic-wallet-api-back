// auth.controller.ts
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthService } from '../encrypt';
import { JWTPayload } from './jwt.payload-interface';

@Controller('auth')
export class JWTAuthController {
  constructor(private readonly JwtAuthService: JwtAuthService) {}

  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const payload: JWTPayload = req.body; 
    const token = await this.JwtAuthService.generateActionToken(payload);
    res.cookie('jwt', token, { httpOnly: true, secure: true }); // HttpOnly et Secure
    return res.send({ message: 'Login successful' });
  }
}