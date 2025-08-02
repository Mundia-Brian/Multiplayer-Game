
FROM node:18-alpine
WORKDIR /app
COPY server.js .
RUN npm install express socket.io
CMD ["node", "server.js"]
