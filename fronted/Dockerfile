# Usamos Node para construir
FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Imagen final con servidor liviano
FROM node:20

WORKDIR /app

COPY --from=builder /app ./

RUN npm install --production

EXPOSE 4321

CMD ["npm", "run", "dev"]
