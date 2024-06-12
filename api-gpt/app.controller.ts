import { Request, Response } from "express";
import axios from "axios";
import { Kinesis } from 'aws-sdk';
import * as dotenv from 'dotenv';

import * as appService from "./app.service";

dotenv.config();

// Configuração do cliente Kinesis
// const kinesis = new Kinesis({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
//   sessionToken: process.env.AWS_SESSION_TOKEN,
//   region: process.env.AWS_REGION
// });

// // Função para publicar no Kinesis
// async function publishToKinesis(streamName: string, partitionKey: string, message: object): Promise<void> {
//   try {
//     const response = await kinesis.putRecord({
//       StreamName: streamName,
//       Data: Buffer.from(JSON.stringify(message)), 
//       PartitionKey: partitionKey
//     }).promise();

//     console.log(`Publicado no Kinesis: ${JSON.stringify(response)}`);
//   } catch (error) {
//     console.error(`Erro ao publicar no Kinesis: ${error}`);
//   }
// }

// Função para notificar e publicar no Kinesis
// async function notifyReturnResponse(id:number, descCurta: string, descLonga:string): Promise<void> {
//   console.log("Entrando na função notifyReturnResponse", descCurta, descLonga);
//   try {
//     const streamName = 'Main_Queue'; 
//     const partitionKey = "1"; 
//     const message = {
//       fluxo: "DescriptionsCompleted",
//       body: {
//         id: id,
//         descricaoCurta: descCurta,
//         descricaoLonga: descLonga
//       }
//     };

//     await publishToKinesis(streamName, partitionKey, message);
//     console.log("Mensagem publicada no Kinesis com sucesso", descCurta, descLonga);
//   } catch (error) {
//     console.error("Erro ao publicar mensagem no Kinesis",  error);
//   }
// }

export async function getDescs(req: Request, res: Response) {
  const texto = req.body.texto;
  const id = req.body.id;

  console.log({ texto });

  if (texto) {
    res.status(201).send({ message: "Demanda recebida com sucesso" });

    try {
      const descCurta = await appService.getDescCurta(texto);
      const descLonga = await appService.getDescLonga(texto);

      // await notifyReturnResponse(id, descCurta, descLonga);

      // await axios.post(`${process.env.WEBHOOK_URL}`, {
      await axios.post(`http://localhost:5000/descriptionsCompleted`, {
        descCurta: descCurta,
        descLonga: descLonga,
      });
    } catch (error) {
      // Lógica para criar Log de erro
    }
  } else {
    // Lógica para criar Log de erro

    res.status(400).send({
      message:
        "Body inválido, é necessário a presença de um campo texto com um valor do tipo string",
    });
  }
}
