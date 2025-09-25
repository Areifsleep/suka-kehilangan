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

  async findByUsernameWithAllPermissions(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
      include: {
        role: {
          include: {
            role_permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async findByIdWithAllPermissions(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        role: {
          include: {
            role_permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
