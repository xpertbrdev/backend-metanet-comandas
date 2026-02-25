import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Utilizar Pino como logger global da aplicação
  app.useLogger(app.get(Logger));

  // Configuração do Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MetaNet Comandas API')
    .setDescription('API backend multi-tenant para o sistema MetaNet Comandas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Aplicação rodando na porta ${port}`);
  logger.log(`Swagger disponível em http://localhost:${port}/api/docs`);
}
bootstrap();
