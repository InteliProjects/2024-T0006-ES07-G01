import { PrismaService } from '../../prismaClient/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    
    return this.prisma.user.create({ data: userData });
  }

  async getUserByName(name: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { name } });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }
}
