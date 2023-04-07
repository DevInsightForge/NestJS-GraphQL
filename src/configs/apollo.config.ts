import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

export const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  subscriptions: {
    "graphql-ws": true,
  },
  context: ({ req, res }: ContextType) => ({
    req,
    res,
  }),
};

export default apolloConfig;
