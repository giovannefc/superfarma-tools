# Build stage - instala todas as dependências e faz o build
FROM node:22-alpine AS builder
WORKDIR /app

# Copia arquivos de dependências primeiro (melhor cache)
COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências (dev + prod)
RUN npm ci

# Gera o Prisma Client
RUN npx prisma generate

# Copia o código fonte
COPY . .

# Faz o build da aplicação
RUN npm run build

# Production stage - apenas dependências de produção
FROM node:22-alpine AS production
WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia schema do Prisma e gera o client para produção
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o build da aplicação
COPY --from=builder /app/build ./build

# Usa o usuário node existente para segurança
RUN chown -R node:node /app
USER node

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]