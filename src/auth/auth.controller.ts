import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { NonceGuard } from 'src/security/nonce/nonce.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(NonceGuard)
  async login(@Body() loginDto: LoginDto) {
    console.log('Login endpoint called with:', loginDto);
    const isValid = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!isValid) {
      return { message: 'Invalid credentials' };
    }

    return { message: 'Login successful' };
  }
}
