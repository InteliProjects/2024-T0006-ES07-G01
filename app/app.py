import json
from flask import Flask, request, jsonify
from moviepy.editor import VideoFileClip
import os
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv
from pydub import AudioSegment
from io import BytesIO
import boto3
from botocore.exceptions import ClientError
import time
from io import BytesIO
from flasgger import Swagger
import logging
import requests



load_dotenv()

class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.swagger = Swagger(self.app)
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'google_credential/credential.json'

        self.IBM_API_KEY = os.getenv("IBM_API_KEY")
        self.IBM_URL = os.getenv("IBM_URL")
        self.AWS_ACCESS_KEY_ID = os.getenv("AWS_ACESS_KEY_ID")
        self.AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
        self.BUCKET_NAME = os.getenv("BUCKET_NAME")

        # self.aws_access_key_id_kinesis=os.environ.get('AWS_ACESS_KEY_ID_KINESIS')
        # self.aws_secret_access_key_kinesis=os.environ.get('AWS_SECRET_ACESS_KEY_KINESIS')
        # self.aws_session_token_kinesis= os.environ.get('AWS_SESSION_TOKEN_KINESIS')
        # self.region_name_kinesis= os.environ.get('AWS_REGION_KINESIS')
        # self.ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL")
        self.ORCHESTRATOR_URL = "http://localhost:5000/saveCompleted"


        self.authenticator = IAMAuthenticator(self.IBM_API_KEY)
        self.stt = SpeechToTextV1(authenticator=self.authenticator)
        self.stt.set_service_url(self.IBM_URL)

        self.setup_routes()

    # # Função para publicar mensagens no Kinesis
    # def publish_to_kinesis(self, stream_name, partition_key, message):
    #     client = boto3.client('kinesis',
    #                           aws_access_key_id=self.aws_access_key_id_kinesis,
    #                           aws_secret_access_key=self.aws_secret_access_key_kinesis,
    #                           aws_session_token=self.aws_session_token_kinesis,
    #                           region_name=self.region_name_kinesis)
    #     try:
    #         response = client.put_record(
    #             StreamName=stream_name,
    #             Data=json.dumps(message),
    #             PartitionKey=partition_key
    #         )
    #         # logger.info(f"Publicado no Kinesis: {response}")
    #     except Exception as e:
    #         print(f"Erro ao publicar no Kinesis: {e}")
    #         #  logger.error(f"Erro ao publicar no Kinesis: {e}")

    # # Função para notificar o resultado ds3
    # def notify_return_response_link_s3(self, s3_link, user_id):
    #     stream_name = 'Main_Queue'
    #     message = {
    #         "fluxo": "SaveMp4Completed",
    #         "body": {
    #             "links3": s3_link,
    #             "usuario": user_id
    #         }
    #     }
    #     partition_key = str(user_id) 
    #     self.publish_to_kinesis(stream_name, partition_key, message)


    # # Função para notificar o resultado da transcrição
    # def notify_return_response_trasncription(self, transcription_results, user_id):
    #     stream_name = 'Main_Queue'
    #      # Extrai e concatena o texto de cada resultado de transcrição
    #     full_transcription_text = " ".join([result['text'] for result in transcription_results])
    #     message = {
    #         "fluxo": "TranscriptionCompleted",
    #         "body": {
    #             "transcription": full_transcription_text,
    #             "id": user_id
    #         }
    #     }
    #     partition_key = str(user_id)   
    #     self.publish_to_kinesis(stream_name, partition_key, message)

    def download_audio_from_s3(self, audio_blob_name):
      s3_url_parts = audio_blob_name.split('/')
      bucket_name = s3_url_parts[2]
      audio_key = '/'.join(s3_url_parts[3:])
    
      try:
          s3 = boto3.client('s3', aws_access_key_id=self.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                            aws_session_token=self.AWS_SESSION_TOKEN)
          response = s3.get_object(Bucket=bucket_name, Key=audio_key)
          audio_content = response['Body'].read()
          print('Conteúdo do áudio baixado com sucesso.')
          return audio_content
      except Exception as e:
          print(f'Erro ao baixar o conteúdo do áudio: {str(e)}')
          return None

    def create_log(self, user_id, service_name, timestamp, processing_time):
        log_data = {
            'user_id': user_id,
            'service_name': service_name,
            'timestamp': timestamp,
            'processing_time': processing_time
        }
        with open('log.json', 'a') as log_file:
            log_file.write(json.dumps(log_data) + '\n')
  

    def convert_wav_to_flac(self, wav_content):
        audio = AudioSegment.from_wav(BytesIO(wav_content))
        flac_buffer = BytesIO()
        audio.export(flac_buffer, format="flac")
        flac_content = flac_buffer.getvalue()
        return flac_content

    def transcribe_audio_continuous(self, audio):
        results = []
        response = self.stt.recognize(audio, content_type='audio/flac', model='pt-BR_Multimedia').get_result()

        for result in response['results']:
            if 'alternatives' in result:
                alternative = result['alternatives'][0]
                recognized_text = alternative['transcript']
                confidence = alternative.get('confidence', None)
                results.append({'text': recognized_text, 'confidence': confidence})

        return results

    def post_s3_link_to_orquestrator(self, s3_link):
      orquestrator_url = self.ORCHESTRATOR_URL
      orquestrator_data = {'linkS3': s3_link, "id":1}
      response = requests.post(orquestrator_url, json=orquestrator_data)
      return response


    def upload_video(self):
        """
        Endpoint para fazer upload de um vídeo e extrair o áudio em formato FLAC.

        ---
        parameters:
          - name: video
            in: formData
            type: file
            description: Vídeo no formato MP4 para upload.

        responses:
          200:
            description: Áudio do vídeo extraído e salvo em FLAC na S3, juntamente com o vídeo em MP4, com sucesso.
            schema:
              properties:
                message:
                  type: string
                  description: Mensagem de sucesso.
                flac_path_s3:
                  type: string
                  description: Caminho do arquivo FLAC resultante na S3.
                mp4_path_s3:
                  type: string
                  description: Caminho do arquivo MP4 enviado na S3.
          400:
            description: Erro de requisição, nenhum vídeo enviado ou extensão de arquivo não permitida.
        """
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        start_time = time.time()  # Marca o tempo de início
        if 'video' not in request.files:
          return jsonify({'error': 'Nenhum vídeo enviado'}), 400

        video = request.files['video']

        ALLOWED_EXTENSIONS = {'mp4'}
        if '.' in video.filename and video.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
            return jsonify({'error': 'Extensão de arquivo não permitida'}), 400

        video_path_temp = 'uploads/' + video.filename
        video.save(video_path_temp)

        video_clip = VideoFileClip(video_path_temp)
        audio_clip = video_clip.audio


        # Configuração do cliente S3
        s3 = boto3.client('s3', aws_access_key_id=self.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                        aws_session_token=self.AWS_SESSION_TOKEN)

        # Define o nome do bucket e o caminho no qual os arquivos serão armazenados
        bucket_name = self.BUCKET_NAME
        videos_path = 'videos/'

        # Faz o upload do arquivo de vídeo
        video_content = video.read()  # Lê o conteúdo do objeto video
        video_bytes = BytesIO(video_content)
        try:
           s3.upload_fileobj(video_bytes, bucket_name, videos_path + video.filename)
           # Chamar a função após o upload bem-sucedido do vídeo
           self.notify_return_response_link_s3(f's3://{bucket_name}/{videos_path}{video.filename}', request.form.get('user_id'))
        except Exception as e:
            return jsonify({'error': f'Erro ao fazer upload do vídeo para o Amazon S3: {str(e)}'}), 500


        wav_path = 'uploads/' + os.path.splitext(video.filename)[0] + '_audio.wav'
        audio_clip.write_audiofile(wav_path, codec='pcm_s16le')

        with open(wav_path, 'rb') as wav_file:
            wav_content = wav_file.read()

        os.remove(wav_path)

        flac_content = self.convert_wav_to_flac(wav_content)

        audio_clip.close()
        video_clip.close()

        # Define o caminho do arquivo de áudio no bucket
        audio_blob_name = 'audios/' + os.path.splitext(video.filename)[0] + '_audio.flac'

        # Faz o upload do arquivo de áudio para o Amazon S3
        try:
          s3.put_object(Bucket=bucket_name, Key=audio_blob_name, Body=flac_content, ContentType='audio/flac')
        except Exception as e:
          return jsonify({'error': f'Erro ao fazer upload do áudio para o Amazon S3: {str(e)}'}), 500


        end_time = time.time()
        processing_time = end_time - start_time

        user_id = request.form.get('user_id')
        self.create_log(user_id, request.path, timestamp, processing_time)

        self.post_s3_link_to_orquestrator(f's3://{bucket_name}/{videos_path}{video.filename}')


        return jsonify({'message': 'Áudio do vídeo extraído e salvo em FLAC na S3, juntamente com o vídeo em MP4, com sucesso.',
                    'mp4_path_s3': f's3://{bucket_name}/{videos_path}{video.filename}',
                    'flac_path_s3': f's3://{bucket_name}/{audio_blob_name}'}), 200


    def transcribe_audio(self):
        """
        Endpoint para realizar a transcrição de um arquivo de áudio.

        ---
        parameters:
          - name: audio_blob_name
            in: formData
            type: string
            required: true
            description: Caminho do arquivo de áudio no serviço de armazenamento.
          - name: user_id
            in: formData
            type: string
            description: ID do usuário associado ao áudio.

        responses:
          200:
            description: Resultados da transcrição.
            schema:
              type: object
              properties:
                transcription_results:
                  type: array
                  items:
                    type: object
                    properties:
                      text:
                        type: string
                        description: Texto transcrito.
                      confidence:
                        type: number
                        description: Confiança na transcrição.
          400:
            description: Erro de requisição, nenhum caminho de áudio enviado.
          500:
            description: Erro ao realizar a transcrição.
        """
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        start_time = time.time()
        audio_blob_name = request.form.get('audio_blob_name')

        if audio_blob_name is None:
            return jsonify({'error': 'Nenhum caminho de áudio enviado'}), 400
        
        audio = self.download_audio_from_s3(audio_blob_name)

        try:
            transcription_results = self.transcribe_audio_continuous(audio)
            # Chamar a função após a transcrição bem-sucedida do áudio
            # self.notify_return_response_transcription(transcription_results, request.form.get('user_id'))
        except Exception as e:
            return jsonify({'error': f'Erro ao realizar a transcrição: {str(e)}'}), 500

        end_time = time.time()
        processing_time = end_time - start_time

        user_id = request.form.get('user_id')
        self.create_log(user_id, request.path, timestamp, processing_time)
        

        return jsonify({'transcription_results': transcription_results}), 200

    def setup_routes(self):
        self.app.add_url_rule('/upload_video', 'upload_video', self.upload_video, methods=['POST'])
        self.app.add_url_rule('/transcribe_audio', 'transcribe_audio', self.transcribe_audio, methods=['POST'])

    def run(self):
        self.app.run(host='0.0.0.0', port=3000, debug=True)

if __name__ == '__main__':
    app_instance = App()
    app_instance.run()
