import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  const uploadsPath = join(process.cwd(), 'uploads');
  
  console.log('📁 Static files directory:', uploadsPath);
  console.log('📂 Process CWD:', process.cwd());
  console.log('📂 __dirname:', __dirname);
  
  // Check if directory exists
  const fs = require('fs');
  if (fs.existsSync(uploadsPath)) {
    console.log('✅ Uploads directory exists');
  } else {
    console.log('❌ Uploads directory NOT found');
  }
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
    // Serve files with these extensions
    dotfiles: 'ignore',
    etag: true,
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
    fallthrough: true,
    index: false,
    lastModified: true,
    maxAge: 0,
    redirect: false,
    setHeaders: (res, path) => {
      res.set('x-timestamp', Date.now().toString());
      // Set proper content type for PDFs
      if (path.endsWith('.pdf')) {
        res.set('Content-Type', 'application/pdf');
      }
    }
  });

  // Enable CORS for frontend
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.lexorholiday.com',
    'https://lexorholiday.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Log CORS requests for debugging
      console.log('CORS Request:', {
        origin,
        allowedOrigins,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
      
      // Allow requests with no origin (like mobile apps, Postman, or curl requests)
      // But log them for security monitoring
      if (!origin) {
        console.warn('CORS: Request with no origin detected');
        // In production, be more careful with no-origin requests
        if (process.env.NODE_ENV === 'production') {
          // Allow but log for monitoring
          return callback(null, true);
        }
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In production, log blocked origins for debugging
        if (process.env.NODE_ENV === 'production') {
          console.error('CORS: Blocked origin:', origin);
          console.error('CORS: Allowed origins:', allowedOrigins);
          // For now, allow but log - you can change this to block if needed
          // callback(new Error('Not allowed by CORS'));
          callback(null, true); // Temporarily allow for debugging
        } else {
          console.warn('CORS: Unknown origin allowed in development:', origin);
          callback(null, true); // Allow in development
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Allow extra properties like 'packages'
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        const constraints = error.constraints;
        if (constraints) {
          return Object.values(constraints).join(', ');
        }
        return `${error.property} has invalid value`;
      });
      return new BadRequestException({
        message: messages,
        error: 'Validation failed',
        statusCode: 400,
      });
    },
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LEXOR Travel API')
    .setDescription('API for LEXOR Travel booking system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
