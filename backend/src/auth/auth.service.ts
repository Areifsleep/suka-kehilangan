import argon2 from 'argon2';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(username: string, password: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!existingUser) {
      throw new HttpException('Username or password is incorrect', 401);
    }

    const match = await argon2.verify(existingUser.password, password);

    if (!match) {
      throw new HttpException('Username or password is incorrect', 401);
    }

    const token = randomUUID();

    const generatedToken = await this.prismaService.session.create({
      data: {
        id_user: existingUser.id_user,
        token,
      },
    });

    return generatedToken.token;
  }

  async logout() {}

  async getSession() {}

  async changePassword() {}
}
