import { PrismaService } from '../../prismaClient/prisma.service';
import { Injectable } from '@nestjs/common';
import { Log } from '@prisma/client';

import { CreateLogDto } from '../dto/log.dto';

@Injectable()
export class LogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(logData: CreateLogDto): Promise<Log> {
    
    return this.prisma.log.create({ data: logData });
  }

}
