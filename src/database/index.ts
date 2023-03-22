import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

const isProd = process.env.NODE_ENV;
const migrationsEntries = join(__dirname, "migrations/*{.ts,.js}");

const devDatabase: DataSourceOptions = {
  type: "sqlite",
  synchronize: true,
  dropSchema: true,
  logging: false,
  database: join(__dirname, "../../db.sqlite"),
  entities: [join(__dirname, "../**/*.model.ts")],
  migrations: [migrationsEntries],
};

const productionDatabase: DataSourceOptions = {
  type: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  synchronize: false,
  dropSchema: false,
  logging: false,
  migrations: [migrationsEntries],
  migrationsRun: true,
};

const AppDataSource = new DataSource({ ...devDatabase });

export const databaseConfig = isProd ? productionDatabase : devDatabase;

export default AppDataSource;
