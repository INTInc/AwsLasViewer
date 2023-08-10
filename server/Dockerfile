FROM node:18-alpine
WORKDIR /usr/awslaslogviewer

# for canvas
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

#ARG NPM_TOKEN
COPY package*.json ./
COPY ./.npmrc ./
RUN npm install

COPY . .
RUN rm -f .npmrc
