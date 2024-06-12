import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from '@prisma/client';

import { VideoRepository } from '../repository/video.repository';
import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async getById(id: number): Promise<Video> {
    const video: Video = await this.videoRepository.getById(id);

    if (!video) {
      throw new NotFoundException('Card não encontrado');
    }

    return video;
  }

  async getByLinkTranscricao(linkTranscricao: string): Promise<Video> {
    const video: Video = await this.videoRepository.getByLinkTranscricao(linkTranscricao);

    if (!video) {
      throw new NotFoundException('Card não encontrado');
    }

    return video;
  }

  async createVideo(videoData: CreateVideoDto): Promise<Video> {
    return await this.videoRepository.create(videoData);
  }

  async update(id: number, videoData: UpdateVideoDto): Promise<Video> {
    return await this.videoRepository.update(videoData, id);
  }
//   async delete(id: number) {
//     return await this.videoRepository.delete(id);
//   }

//   async deleteByColumnId(columnId: number) {
//     return await this.videoRepository.deleteByColumnId(columnId);
//   }

}
