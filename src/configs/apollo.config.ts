import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

interface ConnectionContext extends ContextType {
  connectionParams?: {
    [key: string]: string;
  };
  extra?: {
    request: Request;
  };
}

const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  subscriptions: {
    "graphql-ws": true,
  },
  context: ({ req, res, extra, connectionParams }: ConnectionContext) => {
    if (extra && connectionParams) {
      const params = Object.fromEntries(
        Object.entries(connectionParams).map(([k, v]) => [k.toLowerCase(), v])
      );
      return {
        req: {
          ...extra?.request,
          headers: {
            ...extra?.request?.headers,
            ...params,
          },
        },
        res,
      };
    }
    return {
      req,
      res,
    };
  },
};

export default apolloConfig;
