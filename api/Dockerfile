FROM node

WORKDIR /app
COPY . .

RUN npm install --quiet

RUN npm run build

EXPOSE 3000

