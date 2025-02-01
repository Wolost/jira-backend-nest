# 🚀 Proyecto NestJS con Prisma, Swagger, Docker y Validaciones

## 📌 Descripción del Proyecto
Este proyecto es una API REST desarrollada con **NestJS**, utilizando **Prisma** como ORM, **Swagger** para la documentación, **Docker** para la contenedorización y **class-validator** para validaciones en los DTOs. Además, cuenta con pruebas unitarias e integración configuradas con **Jest** y **Supertest**.

---

## 📋 Características Principales
✅ **NestJS** - Framework de Node.js con arquitectura modular.  
✅ **Prisma** - ORM moderno y potente para la gestión de base de datos.  
✅ **Swagger** - Documentación automática y visual de la API.  
✅ **Docker** - Contenedorización para despliegue y desarrollo ágil.  
✅ **Class-Validator** - Validaciones en DTOs para asegurar datos consistentes.  
✅ **Jest y Supertest** - Pruebas unitarias e integración para asegurar calidad.  

---

## ⚙️ Configuración del Proyecto

### 1️⃣ **Clonar el Repositorio**
```bash
git clone 
cd tu-repositorio
```

### 2️⃣ **Instalar Dependencias**
```bash
npm install
```

### 3️⃣ **Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto y añade:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
PORT=3000
```

---

## 🔧 **Ejecución del Proyecto**

### ▶️ **Ejecutar en Desarrollo**
```bash
npm run start:dev
```

### 🏗 **Construir y Ejecutar en Producción**
```bash
npm run build
npm run start
```

---

## 🗄 **Configuración de Base de Datos con Prisma**

### 1️⃣ **Generar el Cliente de Prisma**
```bash
npx prisma generate
```

### 2️⃣ **Ejecutar Migraciones**
```bash
npx prisma migrate dev --name init
```

### 3️⃣ **Ejecutar Semillas de Datos**
```bash
npm run seed
```

---

## 📑 **Documentación de la API con Swagger**
La documentación de la API está disponible después de iniciar el servidor en:  
➡️ [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## ✅ **Validaciones con Class-Validator**
Se implementan validaciones en los DTOs para asegurar la integridad de los datos.
Ejemplo de un DTO con validaciones:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly projectId: number;
}
```

---

## 🔬 **Pruebas con Jest y Supertest**

### 1️⃣ **Ejecutar Pruebas Unitarias**
```bash
npm run test
```

### 2️⃣ **Ejecutar Pruebas de Integración**
```bash
npm run test:e2e
```

---

## 🐳 **Dockerización del Proyecto**

### 1️⃣ **Construir y Ejecutar con Docker**
```bash
docker-compose up -d
```

### 2️⃣ **Ver Contenedores Activos**
```bash
docker ps
```

### 3️⃣ **Detener y Eliminar Contenedores**
```bash
docker-compose down
```

---

## ⚡ **Decisiones Técnicas**

1️⃣ **Prisma como ORM**: Se eligió Prisma por su facilidad de uso, tipado fuerte y capacidad de generar migraciones fácilmente.  
2️⃣ **NestJS como Framework**: Se utilizó NestJS por su arquitectura modular y soporte para TypeScript.  
3️⃣ **Swagger para Documentación**: Se implementó Swagger para facilitar la exploración y uso de la API.  
4️⃣ **Docker para Contenedorización**: Permite un entorno de desarrollo y despliegue consistente.  
5️⃣ **Class-Validator**: Asegura que los datos enviados a la API sean correctos y válidos.  
6️⃣ **Jest y Supertest**: Garantiza la calidad del código mediante pruebas unitarias e integración.  

---

## 📬 **Contacto y Contribución**
Si quieres contribuir, haz un fork del repositorio y crea un Pull Request con tus mejoras.  

📧 Contacto: [alejomuvez@gmail.com](mailto:alejomuvez@gmail.com)  
💻 Desarrollado con ❤️ por [Alejandro Muñoz - Wolost]  

