FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx nest build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 9100

CMD ["node", "dist/main.js"]
