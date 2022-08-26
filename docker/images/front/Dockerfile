# STAGE 1: install the dependencies (so that this doesn't have to be done on any app source change)
FROM node:14 AS deps

ARG SITE
ARG API_ENDPOINT

# install some things
RUN apt-get update && apt-get install -y nano git gettext

# do sparse git checkout
RUN mkdir -p /usr/src/app/ccn

WORKDIR /usr/src/app/ccn

RUN git init

RUN git remote add -f origin https://github.com/waagsociety/ccnavigator.git

RUN git config core.sparseCheckout true

RUN echo "frontend/" >> .git/info/sparse-checkout

RUN git pull origin master

WORKDIR /usr/src/app/ccn/frontend

RUN npm i
RUN REACT_APP_SITE=$SITE REACT_APP_API_ENDPOINT=$API_ENDPOINT npm run build
RUN npm install -g serve

CMD ["serve", "-s", "build"]
