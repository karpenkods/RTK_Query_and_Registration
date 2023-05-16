FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

ENV PORT=3000

EXPOSE $PORT

RUN yarn build

CMD [ "yarn", "start" ]



