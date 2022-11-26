FROM node:16.14.0

WORKDIR /usr

COPY package.json ./

RUN npm install

COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

COPY tsconfig.json ./
COPY .sequelizerc ./
COPY sequelize.config.js ./

COPY src ./src

EXPOSE 3000