import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { Logger } from "@nestjs/common";
import { GraphQLSchemaHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from "graphql-query-complexity";

@Plugin()
export default class ComplexityPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger("GraphQLComplexity");

  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const { schema } = this.gqlSchemaHost;
    const { logger } = this;

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });
        if (complexity >= 20) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: 20`
          );
        }
        logger.log(`Query Complexity: ${complexity}`);
      },
    };
  }
}
