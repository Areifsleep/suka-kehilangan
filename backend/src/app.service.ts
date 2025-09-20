import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): any {
    const user = this.prisma.user.findMany({});

    return user;
    return 'Hello World!';
  }
}
