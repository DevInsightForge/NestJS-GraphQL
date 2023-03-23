import { config as loadEnvConfigs } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

loadEnvConfigs();

export const modelEntries = join(__dirname, "../modules/**/*.model.ts");
export const migrationsEntries = join(__dirname, "../migrations/*.ts}");

const AppDataSource = new DataSource({
  type: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  synchronize: false,
  dropSchema: false,
  logging: false,
  entities: [modelEntries],
  migrations: [migrationsEntries],
});

export default AppDataSource;
