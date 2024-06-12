import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kinesis, GetRecordsCommand, GetShardIteratorCommand, DescribeStreamCommand } from "@aws-sdk/client-kinesis";
import { WebhookService } from 'src/webhook/service/webhook.service';
import { CreateVideoDto, UpdateVideoDto } from 'src/video/dto/video.dto';

@Injectable()
export class KinesisService implements OnModuleInit {

  constructor(private readonly webhookService: WebhookService) {
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    console.log(process.env.AWS_SESSION_TOKEN);
    console.log(process.env.AWS_REGION);
    this.kinesisClient = new Kinesis({
      region: process.env.AWS_REGION, // Certifique-se de que AWS_REGION esteja definida em .env
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN, // Opcional, necessário para credenciais temporárias
      }
    });
  }

  private readonly logger = new Logger(KinesisService.name);
  private kinesisClient: Kinesis;
  private readonly streamName = 'Main_Queue'; // Substitua pelo nome do seu stream

  async onModuleInit() {
    this.startPolling();
  }

  private startPolling() {
    this.pollForMessages().catch((error) => {
      this.logger.error('Erro ao consumir mensagens: ', error);
      // Dependendo do erro, você pode querer reiniciar o polling ou tratar o erro de forma diferente
    });
  }

  private async pollForMessages() {
    let shardIterator: string | undefined;

    try {
      // pega informações importantes da Stream
      const streamDescription = await this.kinesisClient.send( new DescribeStreamCommand({StreamName: this.streamName}));
      console.log({streamDescription});
      
      // pega o ShardId
      const shardId = streamDescription.StreamDescription.Shards[streamDescription.StreamDescription.Shards.length-1].ShardId;
      console.log({shardId});

      // pega ShardIterator com TRIM_HORIZON (do início ao fim)
      const shardIteratorResponse = await this.kinesisClient.send( new GetShardIteratorCommand({
        StreamName: this.streamName,
        ShardId: shardId,
        ShardIteratorType: 'TRIM_HORIZON',
      }));
      shardIterator = shardIteratorResponse.ShardIterator;

    } catch (error) {
      this.logger.error('Erro ao obter o shard iterator: ', error);
      return;
    }

    while (true) {
      if (!shardIterator) break; // Se por algum motivo o shardIterator não estiver definido, pare o loop.

      try {

        console.log("Novo ciclo de verificação de mensagens na fila")

        // le as mensagens da fila
        const recordsResponse = await this.kinesisClient.getRecords({ ShardIterator: shardIterator });
        console.log("records: ");
        console.log({recordsResponse});
        
        // "move o cursor para frente" da fila
        shardIterator = recordsResponse.NextShardIterator;

        for (const record of recordsResponse.Records) {
          console.log({record});
          const message = JSON.parse(Buffer.from(record.Data).toString());
          console.log(message);
          await this.processMessage(message);
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos antes da próxima iteração para evitar sobrecarga.
      } catch (error) {
        this.logger.error('Erro ao consumir mensagens: ', error);
        // Implemente lógica de tratamento de erro conforme necessário
        break;
      }
    }
  }

  private async processMessage(message: any) {
    // Implemente a lógica de processamento de mensagens aqui
    console.log("AAAAAAAAAAAAA TEM MENSAGEM")
    this.logger.log(`Mensagem recebida: ${JSON.stringify(message)}`);

    const id = message.body.id

    switch(message.fluxo) {
        case 'SaveMp4Completed':
          let bodySave: CreateVideoDto = {
            linkS3: message.body.linkS3,
            usuario: message.body.usuario
          }
          await this.webhookService.saveMp4(id, bodySave);
            break

        case 'TranscriptionCompleted':
          let bodyTranscription: UpdateVideoDto = {
            linkTranscricao: message.body.linkTranscricao,
          }
          await this.webhookService.transcriptionCompleted(id, bodyTranscription);
          break
        case 'DescriptionsCompleted':
          let bodyDescription: UpdateVideoDto = {
            descricaoCurta: message.body.descricao_curta,
            descricaoLonga: message.body.descricao_longa
          }
          await this.webhookService.DescriptionsCompleted(id, bodyDescription);
          break
        case 'CategorizationCompleted':
          let bodyCategory: UpdateVideoDto = {
            categoria: message.body.categoria,
          }
          console.log({bodyCategory})
          await this.webhookService.CategorizationCompleted(id, bodyCategory);
          break
        case 'TaggingCompleted':
          let bodyTagging: UpdateVideoDto = {
            tags: message.body.tags,
          }
          await this.webhookService.TaggingCompleted(id, bodyTagging);
          break
    }
  }
}
