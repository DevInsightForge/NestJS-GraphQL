import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { join } from "path";

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    switch (configService.get<string>("NODE_ENV")) {
      case "production":
        return {
          type: "postgres",
          host: configService.getOrThrow("DB_HOST"),
          port: parseInt(configService.getOrThrow("DB_PORT"), 10),
          username: configService.getOrThrow("DB_USER"),
          password: configService.getOrThrow("DB_PASSWORD"),
          database: configService.getOrThrow("DB_NAME"),
          synchronize: false,
          autoLoadEntities: true,
        };

      case "test":
        return {
          type: "sqlite",
          database: join(__dirname, "../../testdb.sqlite3"),
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        };

      default:
        return {
          type: "sqlite",
          database: join(__dirname, "../../db.sqlite3"),
          synchronize: true,
          dropSchema: false,
          autoLoadEntities: true,
        };
    }
  },
};
