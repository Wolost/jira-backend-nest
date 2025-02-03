import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    const allowedOrigins = [
        'https://jira-frontend-next-production.up.railway.app',
        'http://localhost:3001'
    ];

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Documentation with Swagger')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
}

bootstrap();
