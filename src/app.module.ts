import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import apolloConfig from "./configs/apollo.config";
import databaseConfig from "./configs/database.config";
import MessageModule from "./modules/message/message.module";
import UserModule from "./modules/user/user.module";
import ComplexityPlugin from "./utilities/plugins/complexity.plugin";
import LoggingPlugin from "./utilities/plugins/logging.plugin";
import ValidationProvider from "./utilities/providers/validation.provider";

@Module({
  imports: [
    // --------------------//
    // Env Configurations //
    // --------------------//
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // -------------------------//
    // Database Configurations //
    // -------------------------//
    TypeOrmModule.forRootAsync(databaseConfig),
    // -------------------------------//
    // GraphQL Server Configurations //
    // -------------------------------//
    GraphQLModule.forRoot(apolloConfig),
    // ---------------------//
    // Application Modules //
    // ---------------------//
    UserModule,
    MessageModule,
  ],
  providers: [
    // --------------------//
    // Nest Server Plugins //
    // --------------------//
    ValidationProvider,
    // -----------------------//
    // GraphQL Server Plugins //
    // -----------------------//
    LoggingPlugin,
    ComplexityPlugin,
  ],
})
export default class AppModule {}
