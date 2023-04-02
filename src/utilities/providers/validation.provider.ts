import { ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { GraphQLError } from "graphql";

const ValidationProvider = {
  provide: APP_PIPE,
  useFactory: () =>
    new ValidationPipe({
      exceptionFactory(errors) {
        const inputErrors = errors?.map((err) => ({
          [err?.property]: Object.values(err?.constraints),
        }));
        return new GraphQLError("Input Validation Failed", {
          extensions: {
            code: "VALIDATION_ERROR",
            inputErrors,
          },
        });
      },
    }),
};

export default ValidationProvider;
