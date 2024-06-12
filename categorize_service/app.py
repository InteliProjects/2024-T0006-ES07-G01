from pln_processing import main
from flask import Flask, request, jsonify
import threading
import requests
import logging.config
import json
from datetime import datetime
import pytz
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os

logging.config.fileConfig('logging.conf')
logger = logging.getLogger(__name__)
load_dotenv() 

aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
aws_session_token= os.environ.get('AWS_SESSION_TOKEN')
region_name= os.environ.get('AWS_REGION')

print(aws_access_key_id)
print(aws_secret_access_key)   
print(aws_session_token)
print(region_name)

app = Flask(__name__)
responses = {}

# Define uma função de logging personalizada que formata logs como JSON
def log_json(message, **kwargs):
    timestamp = datetime.now(pytz.timezone('UTC')).isoformat()
    log_message = {"timestamp": timestamp, "message": message, **kwargs}
    logger.info(json.dumps(log_message))

def process_transcription_and_notify(data):
    transcription_id = data.get('id', '')
    log_json("Entrando na funcao process_transcription_and_notify", id=transcription_id)
    try:
        categoria = main(data.get('processedTranscription', ''))
        responses[transcription_id] = categoria
        notify_return_response(transcription_id, categoria)
        log_json("Processamento concluido para a transcricao", id=transcription_id, categoria=categoria)
    except Exception as e:
        log_json("Erro durante o processamento da transcricao", id=transcription_id, error=str(e))

def notify_return_response(transcription_id, categoria):
    log_json("Entrando na função notify_return_response", id=transcription_id, categoria=categoria)
    try:
        # url = 'http://44.205.216.97:5000/webhook/categorizationCompleted'
        url = 'http://localhost:5000/webhook/categorizationCompleted'
        data = {'id': transcription_id, 'categoria': categoria}
        response = requests.post(url, json=data)
        log_json("Notificacao de resultado enviada", id=transcription_id, response=response.text)
    except Exception as e:
        log_json("Erro ao notificar resultado", id=transcription_id, error=str(e))

# def notify_return_response(transcription_id, categoria):
#     log_json("Entrando na funcao notify_return_response", id=transcription_id, categoria=categoria)
#     try:
#         stream_name = 'Main_Queue'  # Substitua pelo nome do seu stream
#         partition_key = str(transcription_id)  # Use o ID da transcrição como chave de partição
#         message = {
#             "fluxo": "CategorizationCompleted",
#             "body": {
#                 "categoria": categoria,
#                 "id": transcription_id
#             }
#         }
#         publish_to_kinesis(stream_name, partition_key, message)
#         log_json("Mensagem publicada no Kinesis com sucesso", id=transcription_id, categoria=categoria)
#     except Exception as e:
#         log_json("Erro ao publicar mensagem no Kinesis", id=transcription_id, error=str(e))


@app.route('/receive_transcription', methods=['POST'])
def receive_transcription():
    data = request.json
    log_json("Recebida transcricao", id=data.get('id', ''))
    threading.Thread(target=process_transcription_and_notify, args=(data,)).start()
    return jsonify({"message": "Transcricao recebida, processamento iniciado."}), 200

# def publish_to_kinesis(stream_name, partition_key, message):
#     client = boto3.client('kinesis',
                          
#     aws_access_key_id=aws_access_key_id,
#     aws_secret_access_key=aws_secret_access_key,
#     aws_session_token= aws_session_token,
#     region_name=  region_name)


#     try:
#         response = client.put_record(
#         StreamName=stream_name,
#         Data=json.dumps(message),
#         PartitionKey=partition_key
#     )
#         logger.info(f"Publicado no Kinesis: {response}")
#     except ClientError as e:
#         logger.error(f"Erro ao publicar no Kinesis: {e}")

if __name__ == '__main__':
    log_json("Iniciando aplicação Flask", status="running")
    app.run(debug=False, host='0.0.0.0', port=8080)