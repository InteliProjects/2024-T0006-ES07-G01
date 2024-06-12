import { Controller, Body, Post } from '@nestjs/common';
import { LogService } from '../service/log.service';
import { CreateLogDto } from '../dto/log.dto';

@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @Post('/log')
  async createLog(@Body() { ...logData }: CreateLogDto): Promise<string> {
    await this.logService.insertLog(logData);

    return 'Log cadastrado com sucesso';
  }
}
