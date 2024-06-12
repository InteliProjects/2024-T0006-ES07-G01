import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaClient/prisma.module';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
