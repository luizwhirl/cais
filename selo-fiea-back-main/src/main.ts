import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    
    // Configuração de arquivos estáticos
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    // Determina as origens permitidas
    const nodeEnv = configService.get<string>('NODE_ENV');
    const frontendUrl = configService.get<string>('FRONTEND_URL');
    
    let allowedOrigins = [];

    if (frontendUrl) {
      // Adiciona as URLs de produção, separadas por vírgula se houver mais de uma
      allowedOrigins = frontendUrl.split(',').map(url => url.trim());
    }

    if (nodeEnv === 'development' || nodeEnv === 'test') {
      // Adiciona as URLs de desenvolvimento se estiver em ambiente local
      allowedOrigins.push('http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'); 
    }
    
    // Configuração de CORS
    app.enableCors({
      origin: allowedOrigins, // Usa a lista dinâmica
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Configuração do prefix global da API
    const apiPrefix = configService.get<string>('PREFIX_API', '/api');
    const apiVersion = configService.get<string>('VERSION', 'v1');
    const globalPrefix = `/${apiPrefix}/${apiVersion}`;
    
    app.setGlobalPrefix(globalPrefix);

    // Configuração global de validação
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    const port = configService.get<number>('PORT', 3000);

    await app.listen(port);

    Logger.log(
      `Application is running on: http://localhost:${port}${globalPrefix}`,
    );
} catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap();