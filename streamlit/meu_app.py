import streamlit as st
import requests
import os
import time
# from dotenv import load_dotenv

# load_dotenv()

# aws_endpoint_url = os.getenv("AWS_ENDPOINT_URL")
# aws_endpoint_url = "http://ec2-35-168-145-26.compute-1.amazonaws.com:3000/upload_video"
aws_endpoint_url = "http://localhost:3000/upload_video"

# Estilo CSS para o spinner
spinner_style = """
    <style>
        .st-spinner>div {
            border-color: #3dabdd;
        }
    </style>
"""

# Estilo CSS para as mensagens de processamento
processing_style = """
    <style>
        .processing-text {
            font-size: 18px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    </style>
"""

def main():
    st.title("Input de Vídeo")

    video_file = st.file_uploader("Clique abaixo para selecionar um vídeo.", type=["mp4"])

    if video_file is not None:
        if st.button("Enviar Vídeo", key="upload_button"):
            #try:
            #    while True:
            #        x, y = pyautogui.position()
            #        print(f"Coordenadas do cursor: X={x}, Y={y}", end='\r')
            #        time.sleep(0.1)  # Atualiza a cada 0.1 segundo
            #except KeyboardInterrupt:
            #    print("\nPrograma encerrado pelo usuário.")
            
            if video_file.type == 'video/mp4':
                data = {"video": video_file.getvalue(), "user_id": 1}
                print("data",data)
                response = requests.post(aws_endpoint_url, files=data)

                
                if response.status_code == 200:
                    st.success("Vídeo enviado com sucesso!")
                    st.markdown(spinner_style, unsafe_allow_html=True)
                    loading_message = st.empty()
                    with st.spinner('Aguarde enquanto o vídeo é processado...'):
                        st.markdown(processing_style, unsafe_allow_html=True)
                        phrases = ["Obtendo transcrição...", "Obtendo descrições curta e longa...", "Obtendo a categoria do vídeo...", "Criando tags...", "Quase lá...", "Finalizando..."]
                        for phrase in phrases:
                            loading_message.markdown(f"<div class='processing-text'>{phrase}</div>", unsafe_allow_html=True)
                            time.sleep(1.5) 

                        loading_message.empty()

                    # Simulacao de resposta
                    respostas = {
                        "Descrições": ["Esta é uma descrição curta.", "Esta é uma descrição longa que contém mais informações."],
                        "Categoria": ["Categoria X"],
                        "Tags": ["tag1", "tag2", "tag3"]
                    }

                    for key, value in respostas.items():
                        st.subheader(key)
                        st.table(value)

                else:
                    st.error(f"Falha ao enviar o vídeo. Código de resposta: {response.status_code}")
            else:
                st.error("Por favor, selecione um arquivo de vídeo no formato MP4.")

if __name__ == "__main__":
    main()
