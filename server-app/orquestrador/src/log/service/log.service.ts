import { Injectable, BadRequestException } from '@nestjs/common';
import { LogRepository } from '../repository/log.repository';
import { CreateLogDto } from '../dto/log.dto';
import { Log } from '.prisma/client';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async insertLog(logData: CreateLogDto): Promise<Log> {
    const encryptedLogData: CreateLogDto = {
      ...logData,
      
    };

    return this.logRepository.createLog(encryptedLogData);
  }

}
