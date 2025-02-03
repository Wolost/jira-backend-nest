# Usa una imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Usar el puerto asignado por Railway
ENV PORT=${PORT}

# Exponer el puerto (opcional, Railway lo maneja automáticamente)
EXPOSE ${PORT}


# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
