import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from the frontend dev servers (Live Server, Vite, etc.)
  // In production this list should come from an environment variable
  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Build the OpenAPI spec and expose it at /api
  // Swagger UI lets you test every endpoint without a separate HTTP client
  const config = new DocumentBuilder()
    .setTitle('Daily Planner API')
    .setDescription('API documentation for the Daily Planner project')
    .setVersion('1.0')
    .build();

  con