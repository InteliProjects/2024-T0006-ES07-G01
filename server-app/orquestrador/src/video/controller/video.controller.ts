import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';
import { User, Video } from '@prisma/client';
import { VideoService } from '../service/video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const createdVideo: Video =
      await this.videoService.createVideo(createVideoDto);

    return { createdVideo };
  }

  @Put('/:id')
  async update(
    @Param() { id }: { id: number },
    @Body() videoData: UpdateVideoDto,
  ) {
    const updatedCard: Video = await this.videoService.update(
      id,
      videoData,
    );

    return { updatedCard };
  }

  
}
