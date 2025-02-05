# 🚀 NestJS Project with Prisma, Swagger, Docker, and Validations

## 📌 Project Description
This project is a REST API developed with **NestJS**, using **Prisma** as ORM, **Swagger** for documentation, **Docker** for containerization, and **class-validator** for DTO validations. Additionally, it includes unit and integration tests configured with **Jest** and **Supertest**.

---

## 📋 Main Features
✅ **NestJS** - Node.js framework with modular architecture.  
✅ **Prisma** - Modern and powerful ORM for database management.  
✅ **Swagger** - Automatic and visual API documentation.  
✅ **Docker** - Containerization for agile deployment and development.  
✅ **Class-Validator** - DTO validations to ensure consistent data.  
✅ **Jest & Supertest** - Unit and integration tests for quality assurance.  

---

## ⚙️ Project Setup

### 1️⃣ **Clone the Repository**
```bash
git clone
cd your-repository
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Configure Environment Variables**
Create a `.env` file at the project root and add:
```env
DATABASE_URL="mysql://user:password@localhost:5432/mydb"
PORT=3001
```

---

## 🔧 **Running the Project**

### ▶️ **Run in Development Mode**
```bash
npm run start:dev
```

### 🏗 **Build and Run in Production**
```bash
npm run build
npm run start
```

---

## 🗄 **Database Setup with Prisma**

### 1️⃣ **Generate Prisma Client**
```bash
npx prisma generate
```

### 2️⃣ **Run Migrations**
```bash
npx prisma migrate dev --name init
```

### 3️⃣ **Seed Database**
```bash
npm run seed
```

---

## 📑 **API Documentation with Swagger**
The API documentation is available after starting the server at:  
➡️ [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## ✅ **Validations with Class-Validator**
DTO validations ensure data integrity. Example of a DTO with validations:
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

## 🔬 **Testing with Jest and Supertest**

### 1️⃣ **Run Unit Tests**
```bash
npm run test
```

### 2️⃣ **Run Integration Tests**
```bash
npm run test:e2e
```

---

## 🐳 **Dockerizing the Project**

### 1️⃣ **Build and Run with Docker**
```bash
docker-compose up -d
```

### 2️⃣ **Check Active Containers**
```bash
docker ps
```

### 3️⃣ **Stop and Remove Containers**
```bash
docker-compose down
```

---

## ⚡ **Technical Decisions**

1️⃣ **Prisma as ORM**: Chosen for its ease of use, strong typing, and simple migration handling.  
2️⃣ **NestJS as Framework**: Used for its modular architecture and TypeScript support.  
3️⃣ **Swagger for Documentation**: Implemented to facilitate API exploration and usage.  
4️⃣ **Docker for Containerization**: Ensures a consistent development and deployment environment.  
5️⃣ **Class-Validator**: Ensures that the data sent to the API is correct and valid.  
6️⃣ **Jest & Supertest**: Guarantees code quality through unit and integration tests.  

---

## 📬 **Contact & Contribution**
If you want to contribute, fork the repository and create a Pull Request with your improvements.  

📧 Contact: [alejomuvez@gmail.com](mailto:alejomuvez@gmail.com)  
💻 Developed with ❤️ by [Alejandro Muñoz - Wolost]  

