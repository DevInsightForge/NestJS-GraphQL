import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const port = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
  });

  await app.listen(port);

  console.log(
    `[SERVER] Server is running on: http://localhost:${port}/graphql`
  );
}

bootstrap();
