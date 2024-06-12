import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaClient/prisma.module';

import { WebhookController } from './controller/webhook.controller';
import { WebhookService } from './service/webhook.service';
import { VideoService } from 'src/video/service/video.service';
import { VideoModule } from 'src/video/video.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [PrismaModule, VideoModule],
  exports: [WebhookService],
})
export class WebhookModule {}
