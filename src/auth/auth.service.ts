import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string, res: Response): Promise<{ accessToken: string, user: any }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { wallets: true }, // Inclure les portefeuilles associés
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ email: user.email, id: user.id }, {
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign({ email: user.email, id: user.id }, {
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return { accessToken, user };
  }

  async register(email: string, password: string, confirmPassword: string): Promise<boolean> {
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    const verificationLink = `${process.env.APP_ROOT}/auth/verify-email/${verificationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Vérification de votre email',
      text: `Cliquez sur ce lien pour vérifier votre adresse email: ${verificationLink}`,
    });

    return true;
  }

  async verifyEmail(token: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired token.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return 'Email successfully verified.';
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordLink = `${process.env.APP_ROOT}/auth/reset-password/${resetToken}`;

    await this.prisma.passwordResets.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetPasswordLink}`,
    });

    return 'Un lien de réinitialisation a été envoyé à votre email';
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { password } = resetPasswordDto;

    const resetRecord = await this.prisma.passwordResets.findFirst({
      where: { token },
    });

    if (!resetRecord) {
      throw new NotFoundException('Token invalide ou expiré');
    }

    const currentTime = new Date();
    if (resetRecord.expiresAt < currentTime) {
      throw new BadRequestException('Le token a expiré');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResets.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return 'Mot de passe réinitialisé avec succès';
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.revoked || new Date(storedToken.expiresAt) < new Date()) {
        throw new UnauthorizedException('Refresh token invalid or expired');
      }

      const newAccessToken = this.jwtService.sign({ email: payload.email, id: payload.id });

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  async logout(refreshToken: string): Promise<void> {

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (storedToken.revoked) {
      throw new UnauthorizedException('Token already revoked');
    }

    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }
}
