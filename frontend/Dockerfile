# Estágio 1: Instalar dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Estágio 2: Configurar o ambiente de desenvolvimento
FROM node:20-alpine
WORKDIR /app
# Copia as dependências já instaladas do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expõe a porta padrão do Angular
EXPOSE 4200

# Comando padrão para iniciar o servidor de desenvolvimento
CMD ["npm", "start", "--", "--host", "0.0.0.0"]