FROM node:22.11.0-bullseye

USER root

RUN npm i -g npm@latest vercel@latest npm-check-updates@latest
RUN apt-get update && apt-get -y install vim git

COPY ./src /home/node/react-dependencies-tree
RUN chown -R node:node /home/node/react-dependencies-tree

USER node
WORKDIR /home/node/react-dependencies-tree