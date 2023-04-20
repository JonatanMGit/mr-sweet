# Build stage
FROM node:19.5.0-alpine as build
WORKDIR /app
COPY package*.json ./
COPY bot/package*.json ./bot/
# support for node-gyp
RUN apk add g++ make py3-pip
RUN npm install
COPY . .
RUN npm run build:bot
RUN npm prune --production



# Production stage
FROM node:19.5.0-alpine
WORKDIR /app
COPY --from=build /app/ .
CMD [ "npm", "run", "start:bot" ]
