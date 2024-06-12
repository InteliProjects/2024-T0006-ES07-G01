from flask import jsonify, request
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
import nltk
from dotenv import load_dotenv
import os
import json
import boto3
from botocore.exceptions import ClientError
import requests

# Instale e baixe os recursos necessários do NLTK
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

# load_dotenv() 

# aws_access_key_id=os.environ.get('AWS_ACESS_KEY_ID')
# aws_secret_access_key=os.environ.get('AWS_SECRET_ACESS_KEY')
# aws_session_token= os.environ.get('AWS_SESSION_TOKEN')
# region_name= os.environ.get('AWS_REGION')

# print(aws_access_key_id)
# print(aws_secret_access_key)   
# print(aws_session_token)
# print(region_name)

from api import app

@app.route('/tags', methods=['POST'])
# def notify_return_response(transcription_id, tags):
#     try:
#         stream_name = 'Main_Queue'  # Substitua pelo nome do seu stream
#         partition_key = str(transcription_id)  # Use o ID da transcrição como chave de partição
#         message = {
#             "fluxo": "TaggingCompleted",
#             "body": {
#                 "tags": tags,
#                 "id": transcription_id
#             }
#         }
#         publish_to_kinesis(stream_name, partition_key, message)
        
#     except Exception as e:
#         print(e)
#         # log_json("Erro ao publicar mensagem no Kinesis", id=transcription_id, error=str(e))

def notify_return_response(transcription_id, tags):
    log_json("Entrando na função notify_return_response", id=transcription_id, tags=tags)
    try:
        # url = 'http://44.205.216.97:5000/webhook/categorizationCompleted'
        url = 'http://localhost:5000/webhook/taggingCompleted'
        data = {'id': transcription_id, 'tags': tags}
        response = requests.post(url, json=data)
        log_json("Notificacao de resultado enviada", id=transcription_id, response=response.text)
    except Exception as e:
        log_json("Erro ao notificar resultado", id=transcription_id, error=str(e))

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
#         print("publicado no Kineses", response)
#         # logger.info(f"Publicado no Kinesis: {response}")
#     except ClientError as e:
#         print(e)
#         # logger.error(f"Erro ao publicar no Kinesis: {e}")

def get_substantivos():
    # Recebe o texto como JSON
    data = request.get_json()
    texto = data['texto']
    transcription_id = data['id']

    # Tokeniza o texto
    tokens = word_tokenize(texto)

    # Remove stopwords
    stop_words = set(stopwords.words('portuguese'))
    tokens_sem_stopwords = [token for token in tokens if token.lower() not in stop_words and token.isalpha()]

    # Identifica os substantivos no texto
    tokens_pos_tag = nltk.pos_tag(tokens_sem_stopwords)
    substantivos = [token for token, pos in tokens_pos_tag if pos.startswith('N')]

    # Conta a frequência dos substantivos
    frequencia_substantivos = FreqDist(substantivos)

    # Obtém os 5 substantivos mais frequentes
    substantivos_mais_frequentes = frequencia_substantivos.most_common(5)
    
    # Formata os substantivos como tags
    tags_substantivos = [f"<{palavra}>" for palavra, _ in substantivos_mais_frequentes]

    notify_return_response(transcription_id, tags_substantivos)
    
    # Retorna os substantivos em formato de tags
    return jsonify(tags_substantivos)
