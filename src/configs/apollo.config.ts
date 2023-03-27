import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  subscriptions: {
    "graphql-ws": true,
    "subscriptions-transport-ws": true,
  },
  context: ({ req }) => ({
    req,
  }),
};

export default apolloConfig;
