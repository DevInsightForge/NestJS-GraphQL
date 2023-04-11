import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export default class JwtTokens {
  @Field()
  refreshToken?: string;

  @Field()
  accessToken?: string;
}
