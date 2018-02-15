FROM node

RUN mkdir -p /node-html-pdf

COPY test/ /node-html-pdf/test/
COPY package.json /node-html-pdf/

WORKDIR /node-html-pdf

RUN npm install

EXPOSE 8080

CMD node test/index.js