import pytest
from app import App

@pytest.fixture
def app():
    app_instance = App()
    return app_instance

@pytest.fixture
def client(app):
    return app.app.test_client()

def test_upload_video(client):
    video_path = 'video_teste/video_teste.mp4'
    user_id = '1'

    with open(video_path, 'rb') as video_file:
        response = client.post('/upload_video', data={'video': (video_file, 'video_teste.mp4'), 'user_id': user_id})
    
    assert response.status_code == 200
    assert 'message' in response.json
    assert 'mp4_path_s3' in response.json
    assert 'flac_path_s3' in response.json

def test_transcribe_audio(client):
    user_id = '1'
    audio_blob_name = 's3://bucket-api-transc/audios/202402291636_audio.flac'

    response = client.post('/transcribe_audio', data={'audio_blob_name': audio_blob_name, 'user_id': user_id})
    
    assert response.status_code == 200
    assert 'transcription_results' in response.json


if __name__ == '__main__':
    pytest.main(['-s', 'test_app.py'])
