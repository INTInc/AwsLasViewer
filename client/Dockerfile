FROM node:16-alpine as build-stage
WORKDIR /usr/awslaslogviewer/static

RUN apk add --no-cache \
    sudo \
    curl \
    build-base \
    g++ \
    libpng \
    libpng-dev \
    jpeg-dev \
    pango-dev \
    cairo-dev \
    giflib-dev \
    python3

#  add glibc and install canvas
RUN apk add gcompat

COPY package*.json ./
COPY ../.npmrc ./
RUN npm install
COPY ./ ./
RUN rm -f .npmrc
RUN npm run build:prod

FROM nginx:1.14-alpine as deploy-stage
COPY --from=build-stage /usr/awslaslogviewer/static/dist /usr/share/nginx/html/dist
COPY --from=build-stage /usr/awslaslogviewer/static/index.html /usr/share/nginx/html/index.html
COPY --from=build-stage /usr/awslaslogviewer/static/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
