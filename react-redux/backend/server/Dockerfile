FROM node:18

WORKDIR /app

RUN npm install -g json-server

COPY db.json .

EXPOSE 5000

CMD ["json-server", "--watch", "db.json", "--host", "0.0.0.0", "--port", "5000"]