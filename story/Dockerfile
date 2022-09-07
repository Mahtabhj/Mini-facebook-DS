FROM node:latest

WORKDIR /usr/src/app

copy package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["node","api/index.js"]
