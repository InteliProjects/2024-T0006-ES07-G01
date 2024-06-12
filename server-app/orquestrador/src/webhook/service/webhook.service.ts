import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import { readFile } from 'fs/promises';
import { VideoService } from '../../video/service/video.service';
import { CreateVideoDto, UpdateVideoDto } from 'src/video/dto/video.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly videoService: VideoService) {}

  async saveMp4(id: number, webhookData: CreateVideoDto): Promise<void> {
    // gera logIn
    this.geraLogIn(id, '/saveVideo', Date.now());

    // salva no bd o link do arquivo na s3
    await this.videoService.createVideo(webhookData);

    console.log('Vou mandar pro bruno o seguinte objeto: ');
    console.log({
      id: id,
      linkS3: webhookData.linkS3,
    });
    // chama serviço de transcrição
    // this.requestToService(
    //   `${process.env.TRANSCRIPTION_URL}`,
    //   {
    //     id: id,
    //     linkS3: webhookData.linkS3,
    //   },
    //   id,
    // );

    // geraLogOut
    this.geraLogOut(id, '/transcribe_audio', Date.now());
  }

  async transcriptionCompleted(
    id: number,
    webhookData: UpdateVideoDto,
  ): Promise<void> {
    // gera logIn
    this.geraLogIn(id, '/transcribe_audio', Date.now());

    // salva no Banco de dados a transcrição
    await this.videoService.update(id, webhookData);

    console.log('Vou mandar pra descricoes o seguinte objeto: ');
    console.log({
      id: id,
      linkTranscricao: webhookData.linkTranscricao,
    });
    // chama serviço de Descrições
    // this.requestToService(
    //   `${process.env.DESCRIPTIONS_URL}`,
    //   {
    //     texto: webhookData.linkTranscricao,
    //     id: id,
    //   },
    //   id,
    // ).catch((error) => {
    //   console.log(error.message);
    // });

    // geraLogOut
    this.geraLogOut(id, '/descriptions', Date.now());


    console.log('Vou mandar pro bruno o seguinte objeto: ');
    console.log({
      id: id,
      linkTranscricao: webhookData.linkTranscricao,
    });
    // chama serviço de Pré-processamento
    // this.requestToService(
    //   `${process.env.PRE_PROCESSING_URL}`,
    //   { transcription: webhookData.linkTranscricao, id: id },
    //   id,
    // );

    // geraLogOut
    this.geraLogOut(id, '/pre-processing', Date.now());
  }

  async preProcessingCompleted(
    id: number,
    webhookData: UpdateVideoDto,
  ): Promise<void> {
    // gera log
    this.geraLogIn(id, '/pre-processing', Date.now());
    // salva no Banco de Dados o pre-processamento
    await this.videoService.update(id, webhookData);

    console.log({
      processedTranscription: webhookData.transcricaoProcessada,
      id: id
    })
    // chama serviço de categorização
    // this.requestToService(
    //   `${process.env.CATEGORIZATION_URL}`,
    //   { processedTranscription: webhookData.transcricaoProcessada, id: id },
    //   id,
    // );
    // geraLogOut
    this.geraLogOut(id, '/categorization', Date.now());
    // chama serviço de tageamento

    console.log({
      processedTranscription: webhookData.transcricaoProcessada,
      id: id
    });
    // this.requestToService(
    //   `${process.env.TAGGING_URL}`,
    //   { processedTranscription: webhookData.transcricaoProcessada, id: id },
    //   id,
    // );
    // geraLogOut
    this.geraLogOut(id, '/tagging', Date.now());
  }

  async DescriptionsCompleted(
    id: number,
    webhookData: UpdateVideoDto,
  ): Promise<void> {
    // gera log
    this.geraLogIn(id, '/getDescs', Date.now());

    // salva no Banco de Dados o pre-processamento
    await this.videoService.update(id, webhookData);
  }

  async CategorizationCompleted(
    id: number,
    webhookData: UpdateVideoDto,
  ): Promise<void> {
    // gera log
    this.geraLogIn(id, '/categorization', Date.now());

    // salva no Banco de Dados o pre-processamento
    await this.videoService.update(id, webhookData);
  }

  async TaggingCompleted(
    id: number,
    webhookData: UpdateVideoDto,
  ): Promise<void> {
    // gera log
    this.geraLogIn(id, '/tagging', Date.now());

    // salva no Banco de Dados o pre-processamento
    await this.videoService.update(id, webhookData);
  }

  async geraLogIn(id: number, from: string, timestamp: number) {
    const logEntry = {
      userId: id,
      from: from,
      timestamp: timestamp,
    };

    try {
      // Tenta ler o arquivo logs.json
      let data = await readFile('src/logs.json', 'utf8');
      let logs = JSON.parse(data);

      // Verifica se o conteúdo é um array e adiciona o novo log
      if (Array.isArray(logs)) {
        logs.push(logEntry);
      } else {
        // Se o conteúdo não é um array, inicia um novo array com o logEntry
        logs = [logEntry];
      }

      // Escreve o array atualizado de volta para o arquivo logs.json
      await fs.writeFile(
        'src/logs.json',
        JSON.stringify(logs, null, 2),
        'utf8',
      );
    } catch (error) {
      // Loga qualquer outro erro que não seja a ausência do arquivo
      console.error('Erro ao gerar log:', error);
    }
  }

  async geraLogOut(id: number, to: string, timestamp: number) {
    const logOut = {
      userId: id,
      to: to,
      timestamp: timestamp,
    };

    try {
      // Tenta ler o arquivo logs.json
      let data = await fs.readFile('src/logs.json', 'utf8');
      let logs = JSON.parse(data);

      // Verifica se o conteúdo é um array e adiciona o novo log
      if (Array.isArray(logs)) {
        logs.push(logOut);
      } else {
        // Se o conteúdo não é um array, inicia um novo array com o logOut
        logs = [logOut];
      }

      // Escreve o array atualizado de volta para o arquivo logs.json
      await fs.writeFile(
        'src/logs.json',
        JSON.stringify(logs, null, 2),
        'utf8',
      );
    } catch (error) {
      // Loga qualquer outro erro que não seja a ausência do arquivo
      console.error('Erro ao gerar log:', error);
    }
  }

  async requestToService(url: string, body, id: number): Promise<void> {
    await axios.post(url, {
      userId: id,
      ...body,
    });
  }
}
