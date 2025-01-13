import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'domaineàchanger.com', 
    methods: 'GET,POST,PUT,DELETE',
  });
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';",
    );
    next();
  });

  await app.listen(3000);
}
bootstrap();