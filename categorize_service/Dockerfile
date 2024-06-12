# Use a imagem oficial do Python como imagem base
FROM python:3.11

# Define o diretório de trabalho no container
WORKDIR /categorize_service

COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

# Copia o resto dos arquivos da sua aplicação para o container
COPY . .

# Define o comando para rodar a aplicação
CMD ["python", "./app.py"]
