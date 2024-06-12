import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';

import { User, Video } from '@prisma/client';
import { WebhookService } from '../service/webhook.service';
import { CreateVideoDto, UpdateVideoDto } from 'src/video/dto/video.dto';
import { VideoService } from 'src/video/service/video.service';

@Controller('/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService, private readonly videoService: VideoService) {}

  @Post('/saveCompleted')
  async saveCompleted(@Body() webhookData: {linkS3: string, id: number}) {
    console.log("Bati na rota save")
    // Validar o body da requisição com a DTO
    if (!webhookData.linkS3 || !webhookData.id) {
      throw new Error('Invalid request body');
    }

    const createVideoData: CreateVideoDto = {
        linkS3: webhookData.linkS3,
        usuario: {
          connect: {
            id: webhookData.id 
          }
        } 
    } 
    console.log("chegou até aqui")
    console.log({createVideoData})
    console.log("id: " + webhookData.id)
    // Chamar o método correspondente no serviço
    this.webhookService.saveMp4(webhookData.id, createVideoData);
    return { status: 'success' };
  }

  @Post('/transcriptionCompleted')
  async transcriptionCompleted(@Body() webhookData: {linkTranscricao: string, id: number}) {
    console.log("Bati na rota transcription")
    // Validar o body da requisição com a DTO
    if (!webhookData.linkTranscricao || !webhookData.id) {
      throw new Error('Invalid request body');
    }

    console.log("vou entrar no getById")
    const video: Video = await this.videoService.getById(webhookData.id);
    console.log("saí do getById")
    console.log({video})

    const updateVideoData: UpdateVideoDto = {
        linkTranscricao: webhookData.linkTranscricao
    } 
    console.log("chegou até aqui")
    console.log({updateVideoData})
    console.log("id: " + webhookData.id)
    // Chamar o método correspondente no serviço
    this.webhookService.transcriptionCompleted(video.id, updateVideoData);
    return { status: 'success' };
  }

  @Post('/preProcessingCompleted')
  async preProcessingCompleted(@Body() webhookData: {transcricaoProcessada: string[], id: number}) {
    // Validar o body da requisição com a DTO
    if (!webhookData.transcricaoProcessada) {
      throw new Error('Invalid request body');
    }

    //monta UpdateVideoDto
    const updateVideoData: UpdateVideoDto = {
        transcricaoProcessada: webhookData.transcricaoProcessada
    } 
    
    // Chamar o método correspondente no serviço
    this.webhookService.preProcessingCompleted(webhookData.id, updateVideoData);
    return { status: 'success' };
  }

  @Post('/descriptionsCompleted')
  async DescriptionsCompleted(@Body() webhookData: {id: number, descricaoCurta: string, descricaoLonga: string}) {
    // Validar o body da requisição com a DTO
    if (!webhookData.descricaoCurta || !webhookData.descricaoLonga) {
      throw new Error('Invalid request body');
    }

    //monta UpdateVideoDto
    const updateVideoData: UpdateVideoDto = {
        descricaoCurta: webhookData.descricaoCurta,
        descricaoLonga: webhookData.descricaoLonga
    } 
    
    // Chamar o método correspondente no serviço
    this.webhookService.DescriptionsCompleted(webhookData.id, updateVideoData);
    return { status: 'success' };
  }


  @Post('/categorizationCompleted')
  async CategorizationCompleted(@Body() webhookData: { id: number, categoria: string}) {
    // Validar o body da requisição com a DTO
    if (!webhookData.categoria) {
      throw new Error('Invalid request body');
    }

    //monta UpdateVideoDto
    const updateVideoData: UpdateVideoDto = {
        categoria: webhookData.categoria
    } 
    
    // Chamar o método correspondente no serviço
    this.webhookService.CategorizationCompleted(webhookData.id, updateVideoData);
    return { status: 'success' };
  }

  @Post('/taggingCompleted')
  async TaggingCompleted(@Body() webhookData: {id: number, tags: string[]}) {
    // Validar o body da requisição com a DTO
    if (!webhookData.tags) {
      throw new Error('Invalid request body');
    }

    //monta UpdateVideoDto
    const updateVideoData: UpdateVideoDto = {
        tags: webhookData.tags
    } 
    
    // Chamar o método correspondente no serviço
    this.webhookService.TaggingCompleted(webhookData.id, updateVideoData);
    return { status: 'success' };
  }

}
