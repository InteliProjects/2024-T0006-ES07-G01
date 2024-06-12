import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { WebhookModule } from './webhook/webhook.module';
import { KinesisModule } from './kinesis/kinesis.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [UserModule, VideoModule, WebhookModule, KinesisModule, LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
