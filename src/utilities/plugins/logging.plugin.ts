import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { Logger } from "@nestjs/common";

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger("GraphQLLogger");

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const logger = this.logger;
    const start = Date.now();
    let operation: string;

    return {
      async didResolveOperation(context) {
        operation = context?.operationName;
      },
      async willSendResponse(context) {
        const stop = Date.now();
        const elapsed = stop - start;
        const size = JSON.stringify(context?.response).length * 2;
        logger.log(
          `Operation ${operation} completed in ${elapsed} ms and returned ${size} bytes`
        );
      },
    };
  }
}
