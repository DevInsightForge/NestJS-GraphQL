import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApolloServerModule } from "./configs/apollo.config";
import { DatabaseModule } from "./configs/database.config";
import { RecipesModule } from "./modules/recipes/recipes.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //-------------------------//
    // Database Configurations //
    //-------------------------//
    DatabaseModule,
    //------------------------------//
    // Apollo Server Configurations //
    //------------------------------//
    ApolloServerModule,
    //---------------------//
    // Application Modules //
    //---------------------//
    RecipesModule,
  ],
})
export class AppModule {}
