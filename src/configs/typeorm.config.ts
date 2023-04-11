// eslint-disable-next-line import/no-extraneous-dependencies
import { config as loadEnvConfigs } from "dotenv";
import { DataSource } from "typeorm";
import { userRefreshMessage1680887435923 } from "../migrations/1680887435923-user-refresh-message";
import { userMessage1680890836536 } from "../migrations/1680890836536-user-message";
import { chatMessageUser1681195936471 } from "../migrations/1681195936471-chat-message-user";
import RefreshToken from "../modules/authentication/models/refreshToken.model";
import Chat from "../modules/chat/models/chat.model";
import Message from "../modules/message/models/message.model";
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
  entities: [User, RefreshToken, Message, Chat],
  migrations: [
    userRefreshMessage1680887435923,
    userMessage1680890836536,
    chatMessageUser1681195936471,
  ],
});

export default AppDataSource;
