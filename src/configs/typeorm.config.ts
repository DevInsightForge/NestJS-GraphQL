import { config as loadEnvConfigs } from "dotenv";
import { DataSource } from "typeorm";
import { migrationsEntries, modelEntries } from "./paths.config";

loadEnvConfigs();

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
