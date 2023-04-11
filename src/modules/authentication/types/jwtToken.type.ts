import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JwtTokens {
  @Field()
  refreshToken?: string;

  @Field()
  accessToken?: string;
}
