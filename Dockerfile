FROM node:16.18 as build-stage 

COPY . .

RUN yarn install

ARG BOT_TOKEN
ENV BOT_TOKEN=${BOT_TOKEN}

ARG BOT_ID
ENV BOT_ID=${BOT_ID}

ARG DBL_TOKEN
ENV DBL_TOKEN=${DBL_TOKEN}

ENTRYPOINT [ "node", "startup.js" ]