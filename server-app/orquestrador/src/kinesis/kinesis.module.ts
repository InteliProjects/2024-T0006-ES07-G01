import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaClient/prisma.module';
import { KinesisService } from './service/kinesis.service';
import { WebhookModule } from 'src/webhook/webhook.module';

@Module({
  controllers: [],
  providers: [KinesisService],
  imports: [WebhookModule],
  exports: [],
})
export class KinesisModule {}
