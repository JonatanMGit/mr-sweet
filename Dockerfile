FROM node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd ./bot && npm run build 

CMD [ "npm", "run", "start:bot" ]