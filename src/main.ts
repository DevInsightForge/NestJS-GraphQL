import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";

const logger = new Logger("Server");

const main = async (): Promise<string> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get("PORT", "4000"), 10);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true,
  });

  await app.listen(port);

  return `${await app.getUrl()}`;
};

main()
  .then((serverUrl) => logger.log(`Server is running on: ${serverUrl}/graphql`))
  .catch(() => logger.error("Something went wrong!"));
