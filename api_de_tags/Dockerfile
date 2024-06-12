# Use a imagem base do Python
FROM python:3.9

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários para o diretório de trabalho
COPY . .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Expõe a porta em que a aplicação Flask está sendo executada
EXPOSE 5000

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["python", "run.py"]
