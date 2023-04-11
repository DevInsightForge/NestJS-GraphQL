import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { apolloConfig } from "./configs/apollo.config";
import { databaseConfig } from "./configs/database.config";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { ChatModule } from "./modules/chat/chat.module";
import { MessageModule } from "./modules/message/message.module";
import { UserModule } from "./modules/user/user.module";
import { LoggingPlugin } from "./utilities/plugins/logging.plugin";
import { AuthGuardProvider } from "./utilities/providers/authGuard.provider";
import { ValidationProvider } from "./utilities/providers/validation.provider";

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
    AuthenticationModule,
    ChatModule,
    MessageModule,
  ],
  providers: [
    // --------------------//
    // Nest Server Plugins //
    // --------------------//
    ValidationProvider,
    AuthGuardProvider,
    // -----------------------//
    // GraphQL Server Plugins //
    // -----------------------//
    LoggingPlugin,
  ],
})
export class AppModule {}
