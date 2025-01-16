import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/PrismaService';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user && user.password === password;
  }
}
