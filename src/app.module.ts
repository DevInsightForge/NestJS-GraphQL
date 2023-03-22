import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./database";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //-------------------------//
    // Database Configurations //
    //-------------------------//
    TypeOrmModule.forRoot({
      ...databaseConfig,
      autoLoadEntities: true,
    }),
    //------------------------------//
    // Apollo Server Configurations //
    //------------------------------//
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({
        req,
      }),
    }),
    //---------------------//
    // Application Modules //
    //---------------------//
    RecipesModule,
  ],
})
export class AppModule {}
