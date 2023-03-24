import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const port = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Server");

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
  });

  await app.listen(port);

  logger.log(`Server is running on: ${await app.getUrl()}/graphql`);
}

bootstrap();
