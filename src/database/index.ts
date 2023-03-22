import "reflect-metadata";

import { join } from "path";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "sqlite",
  logging: false,
  database: join(__dirname, "../../db.sqlite"),
  entities: [join(__dirname, "../**/*.model.ts")],
  migrations: [join(__dirname, "migrations/*{.ts,.js}")],
});

export default AppDataSource;
