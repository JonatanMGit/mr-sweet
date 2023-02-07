# Build stage
FROM node:19.5.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd ./bot && npm run build

# Production stage
FROM node:19.5.0-alpine
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY . .
CMD [ "npm", "run", "start:bot" ]
