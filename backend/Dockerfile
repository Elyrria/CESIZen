FROM node:23-alpine

# Installer les dépendances système pour la compilation native (bcrypt, sharp, etc.)
# hadolint ignore=DL3018
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm ci

# Copie le code source
COPY api ./api
COPY configs ./configs
COPY aliases.mjs ./

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]