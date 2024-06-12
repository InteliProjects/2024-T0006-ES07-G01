import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaClient/prisma.module';
import { LogService } from './service/log.service';
import { LogController } from './controller/log.controller';
import { LogRepository } from './repository/log.repository';

@Module({
  controllers: [LogController],
  providers: [LogService, LogRepository],
  imports: [PrismaModule],
  exports: [LogService],
})
export class LogModule {}
