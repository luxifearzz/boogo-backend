FROM node:slim

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]