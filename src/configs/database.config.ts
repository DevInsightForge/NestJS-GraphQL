import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { join } from "path";

const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const isProd = Boolean(configService.get("NODE_ENV") === "production");
    return isProd
      ? {
          type: "postgres",
          host: configService.getOrThrow("DB_HOST"),
          port: parseInt(configService.getOrThrow("DB_PORT"), 10),
          username: configService.getOrThrow("DB_USER"),
          password: configService.getOrThrow("DB_PASSWORD"),
          database: configService.getOrThrow("DB_NAME"),
          synchronize: false,
          autoLoadEntities: true,
        }
      : {
          type: "sqlite",
          database: join(__dirname, "../../db.sqlite3"),
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        };
  },
};

export default databaseConfig;
