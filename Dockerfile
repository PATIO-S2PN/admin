FROM node

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8004

CMD ["npm", "start"]