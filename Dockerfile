# Build stage
FROM node:19.5.0-alpine as build
WORKDIR /app
COPY package*.json ./
COPY bot/package*.json ./bot/
# support for node-gyp and canvas
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \

    libtool \
    autoconf \
    automake \
    py3-pip \
    pkgconfig

RUN npm install
COPY . .
RUN npm run build:bot
RUN npm prune --production



# Production stage
FROM node:19.5.0-alpine
WORKDIR /app
RUN apk add --update --no-cache \
    cairo \
    pango \
    jpeg \
    giflib
COPY --from=build /app/ .
CMD [ "npm", "run", "start:bot" ]
