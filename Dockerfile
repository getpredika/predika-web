# Build stage
FROM node:20.12.2-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d/*

COPY --from=build /app/dist .
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/gzip.conf /etc/nginx/conf.d/gzip.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]