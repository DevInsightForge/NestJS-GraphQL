import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";

const logger = new Logger("Server");
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const main = async (): Promise<string> => {
  const app = await NestFactory.create(AppModule);

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
