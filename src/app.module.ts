import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import apolloConfig from "./configs/apollo.config";
import databaseConfig from "./configs/database.config";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { ComplexityPlugin } from "./utilities/plugins/complexity.plugin";
import { LoggingPlugin } from "./utilities/plugins/logging.plugin";

@Module({
  imports: [
    //--------------------//
    // Env Configurations //
    //--------------------//
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //-------------------------//
    // Database Configurations //
    //-------------------------//
    TypeOrmModule.forRootAsync(databaseConfig),
    //-------------------------------//
    // GraphQL Server Configurations //
    //-------------------------------//
    GraphQLModule.forRoot(apolloConfig),
    //---------------------//
    // Application Modules //
    //---------------------//
    RecipesModule,
  ],
  providers: [
    //------------------------//
    // GraphQL Server Plugins //
    //------------------------//
    LoggingPlugin,
    ComplexityPlugin,
  ],
})
export class AppModule {}
