# Imagem base
FROM node:16-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos `package.json` e `package-lock.json` (ou `npm-shrinkwrap.json`)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Expõe a porta que o servidor Express usa
EXPOSE 5028

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
