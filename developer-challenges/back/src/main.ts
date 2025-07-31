import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar CORS 
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
  });

  // 2. Adicionar o ValidationPipe globalmente 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(PORT);
  console.log(`Nest está rodando na porta ${PORT}`);

  //app.enableCors({
   // origin: '*', // Ajustar depois para p front!(ex: 'http://localhost:3000')
   // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //  credentials: true,
//  });

}
bootstrap();