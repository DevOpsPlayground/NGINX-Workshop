FROM node:alpine3.16

WORKDIR /server
RUN npm init -y
RUN npm install express cors
COPY server.js .
EXPOSE 80
CMD ["npm", "start"]

