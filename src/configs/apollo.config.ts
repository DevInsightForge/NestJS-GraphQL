import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  installSubscriptionHandlers: true,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  context: ({ req }) => ({
    req,
  }),
};

export default apolloConfig;
