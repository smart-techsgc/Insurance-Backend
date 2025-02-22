FROM node:alpine

WORKDIR /app/sgc_project

COPY package.json .

RUN yarn install

COPY . .

RUN yarn run migrate

EXPOSE 8888

CMD [ "yarn", "run", "start" ]