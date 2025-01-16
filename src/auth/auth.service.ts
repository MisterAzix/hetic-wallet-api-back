import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    this.logger.log(`Validating user with email: ${email}`);
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      this.logger.log(`User found: ${email}`);
      const isValid = user.password === password;
      this.logger.log(`Password validation result: ${isValid}`);
      return isValid;
    } else {
      this.logger.warn(`User not found: ${email}`);
      return false;
    }
  }
}
