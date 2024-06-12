import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaClient/prisma.module';

import { VideoController } from './controller/video.controller';
import { VideoService } from './service/video.service';
import { VideoRepository } from './repository/video.repository';

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
  imports: [PrismaModule],
  exports: [VideoService],
})
export class VideoModule {}
