# Frontend Dockerfile pour CESIZEN
FROM node:23-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY src ./src
COPY public ./public
COPY index.html ./

# Build l'application
RUN npm run build

# Exposer le port
EXPOSE 5173

# Commande de démarrage en mode preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]