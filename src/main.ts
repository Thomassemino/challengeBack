import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application...');
    
    const app = await NestFactory.create(AppModule);

    // ✅ CORS configurado con variable de entorno
    const allowedOrigins = [
      'https://challengefront.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Filtrar valores undefined

    console.log('🔒 CORS origins allowed:', allowedOrigins);
    
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // ✅ Validaciones globales
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // ✅ Swagger config (solo en desarrollo o si se especifica)
    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DOCS === 'true') {
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
      console.log('📚 Swagger docs available at /api/docs');
    }

    // ✅ Puerto dinámico para Render
    const port = process.env.PORT || 3000;
    console.log(`🔧 Attempting to start server on port: ${port}`);
    console.log(`🌍 Binding to: 0.0.0.0:${port}`);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Server successfully started on port ${port}`);
    console.log(`🌐 Server running at: http://0.0.0.0:${port}`);
    console.log(`📊 Health check: http://0.0.0.0:${port}/`);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// ✅ Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();