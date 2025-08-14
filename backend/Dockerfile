FROM node:23-alpine

# Installer les dépendances système pour la compilation native (bcrypt, sharp, etc.)
RUN apk add --no-cache python3=3.11.6-r0 make=4.3-r1 g++=12.2.1_git20220924-r4

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