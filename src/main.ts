import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const port = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  console.log(
    `[WEB] Application is running on: http://localhost:${port}/graphql`
  );
}

bootstrap();
