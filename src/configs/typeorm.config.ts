// eslint-disable-next-line import/no-extraneous-dependencies
import { config as loadEnvConfigs } from "dotenv";
import { DataSource } from "typeorm";
import { userRefreshMessage1680887435923 } from "../migrations/1680887435923-user-refresh-message";
import Message from "../modules/message/models/message.model";
import RefreshToken from "../modules/user/models/refreshToken.model";
import User from "../modules/user/models/user.model";

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
  entities: [User, RefreshToken, Message],
  migrations: [userRefreshMessage1680887435923],
});

export default AppDataSource;
