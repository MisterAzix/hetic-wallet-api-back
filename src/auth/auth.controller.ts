import { Controller, Post, Get, Param, Body, Req, Res, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password } = loginDto;
    const { accessToken, user } = await this.authService.login(email, password, res);

    return res.json({ message: 'Login successful', accessToken, user });
  }



  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<boolean> {
    const { email, password, confirmPassword } = registerDto;
    return this.authService.register(email, password, confirmPassword);
  }

  @Get('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response
  ) {
    try {
      const message = await this.authService.resetPassword(token, resetPasswordDto);
      return res.json({ message });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    return this.authService.refreshTokens(body.refreshToken, res);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found' });
    }

    try {
      await this.authService.logout(refreshToken);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
  }
}
