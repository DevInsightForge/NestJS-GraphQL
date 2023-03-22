import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [
    //-------------------------//
    // Database Configurations //
    //-------------------------//
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: join(__dirname, "../db.sqlite"),
      synchronize: false,
      dropSchema: false,
      logging: false,
      autoLoadEntities: true,
      migrations: [join(__dirname, "database/migrations/*{.ts,.js}")],
      migrationsRun: true,
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
