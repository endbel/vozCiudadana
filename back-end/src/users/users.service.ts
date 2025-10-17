import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(userId: string) {
    return this.prisma.person.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getByEmail(email: string) {
    return this.prisma.person.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(email: string, hashedPassword: string) {
    return this.prisma.person.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
