FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd ./bot && npm run build 

CMD [ "npm", "run", "start:bot" ]