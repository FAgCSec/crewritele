# Imagen base
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del proyecto al contenedor
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto del backend
EXPOSE 3001

# Comando por defecto
CMD ["node", "server.js"]
