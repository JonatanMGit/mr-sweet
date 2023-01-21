FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

CMD [ "npm", "start" ]