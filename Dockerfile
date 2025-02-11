# Etapa 1: Construção da Aplicação
FROM node:20-alpine AS build

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências primeiro
COPY package.json package-lock.json ./

# Instala dependências de forma otimizada
RUN npm ci --only=production

# Copia o restante dos arquivos da aplicação
COPY . .

# Etapa 2: Criar a Imagem Final
FROM node:20-alpine

# Define diretório de trabalho na imagem final
WORKDIR /app

# Copia apenas os arquivos necessários da etapa anterior
COPY --from=build /app /app

# Define a porta exposta pelo container
EXPOSE 9001

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
