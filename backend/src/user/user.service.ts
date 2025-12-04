import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsernameWithRole(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
  }

  async findByIdWithRole(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        role: true,
      },
    });
  }
}
