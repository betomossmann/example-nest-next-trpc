import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from '@server/trpc/trpc.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //habilitar cors
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app); //aplicar middleware
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
