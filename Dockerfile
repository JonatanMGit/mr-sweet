# Build stage
FROM node:19.5.0 as build
WORKDIR /app
COPY package*.json ./
COPY bot/package*.json ./bot/
# support for node-gyp and canvas
RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN npm install
COPY . .
RUN npm run build:bot
RUN npm prune --production

# Production stage
FROM node:19.5.0
WORKDIR /app
# only runtime requirements for canvas
RUN apt update && apt install -y libcairo2 libpango1.0-0 libjpeg62-turbo libgif7 librsvg2-2
COPY --from=build /app/ .
CMD [ "npm", "run", "start:bot" ]
