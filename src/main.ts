import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Repository search')
    .setDescription('Repository search API documentation (coding challenge to ShopApotheke)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  await app.listen(PORT);
}

bootstrap();