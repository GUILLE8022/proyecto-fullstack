# Dockerfile en la RAÍZ del repo — Railway NO necesita Root Directory = backend
FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

COPY backend/ .

RUN mkdir -p uploads/motos

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
