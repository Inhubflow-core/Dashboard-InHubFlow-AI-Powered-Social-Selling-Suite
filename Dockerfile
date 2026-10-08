FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copiar definiciones de dependencias
COPY package*.json ./

# Instalar todas las dependencias incluyendo devDependencies (TypeScript, Tailwind, loaders)
# --include=dev garantiza que se instalen aunque Coolify inyecte NODE_ENV=production
RUN npm ci --include=dev

# Copiar el codigo fuente completo
COPY . .

# Soportar BASE_PATH en buildtime para rutas como /dashboard
ARG BASE_PATH=""
ARG NEXT_PUBLIC_BASE_PATH=""
ENV BASE_PATH=$BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NODE_ENV=production

# Compilar la aplicacion Next.js
RUN npm run build

# Variables de runtime
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
