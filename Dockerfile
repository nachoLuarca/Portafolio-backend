FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de capas de Docker
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# La imagen base node:20-alpine ya trae un usuario "node" (uid 1000) sin
# privilegios. Le damos dueño de /app (npm install corrió como root) y
# corremos el proceso con él, para no ejecutar como root dentro del
# contenedor.
RUN chown -R node:node /app
USER node

EXPOSE 4000

CMD ["node", "server.js"]
