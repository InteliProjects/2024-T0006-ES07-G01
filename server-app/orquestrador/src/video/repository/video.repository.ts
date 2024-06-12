import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaClient/prisma.service';
import { Video } from '@prisma/client';

import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';

@Injectable()
export class VideoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(videoData: CreateVideoDto): Promise<Video> {
    return await this.prisma.video.create({
      data: videoData,
    });
  }

  async getById(id: number): Promise<Video> {
    return await this.prisma.video.findFirst({
      where: {
        id,
      },
    });
  }

  async getByLinkS3(linkS3: string): Promise<Video> {
    return await this.prisma.video.findFirst({
      where: {
        linkS3,
      },
    });
  }

  async getByLinkTranscricao(linkTranscricao: string): Promise<Video> {
    return await this.prisma.video.findFirst({
      where: {
        linkTranscricao,
      },
    });
  }

  async getByTranscricaoProcessada(transcricaoProcessada: any): Promise<Video> {
    return await this.prisma.video.findFirst({
      where: {
        transcricaoProcessada,
      },
    });
  }

  async update(videoData: UpdateVideoDto, videoId: number): Promise<Video> {
    return await this.prisma.video.update({
      where: {
        id: videoId,
      },
      data: videoData,
    });
  }

//   async delete(id: number): Promise<KanbanCard> {
//     return await this.prisma.video.delete({
//       where: {
//         id,
//       },
//     });
//   }

//   async deleteByColumnId(columnId: number) {
//     return await this.prisma.video.deleteMany({
//       where: {
//         columnId,
//       },
//     });
//   }

}
