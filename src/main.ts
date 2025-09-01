import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS configurado con variable de entorno
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,POST,PATCH,DELETE',
  });

  // ✅ Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Notes Challenge API')
    .setDescription('API for Notes Management Challenge - Ensolvers')
    .setVersion('1.0')
    .addTag('notes', 'Notes operations')
    .addTag('categories', 'Categories operations')
    .addTag('auth', 'Authentication operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Puerto dinámico para Render
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 👈 importante en Render

  console.log(`🚀 Application is running on port: ${port}`);
  console.log(`📚 Swagger docs available at: http://0.0.0.0:${port}/api/docs`);
}

bootstrap();
