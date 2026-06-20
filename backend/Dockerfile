FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY index.js ./
COPY data ./data

EXPOSE 3001

CMD ["npm", "start"]
