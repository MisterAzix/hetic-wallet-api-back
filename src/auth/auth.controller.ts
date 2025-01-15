import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { UserResponse } from './interfaces/user-response.interface';
import { Tokens } from './interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponse> {
    const { email, password, passwordConfirm } = registerDto;
    return this.authService.register(email, password, passwordConfirm);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<Tokens> {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    const tokens = await this.authService.generateTokens(user);

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<Tokens> {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.authService.validateRefreshToken(refreshToken);
    const tokens = await this.authService.generateTokens(user);

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    await this.authService.forgotPassword(email);
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, passwordConfirm } = resetPasswordDto;
    await this.authService.resetPassword(token, newPassword, passwordConfirm);
    return { message: 'Password reset successfully' };
  }
}
