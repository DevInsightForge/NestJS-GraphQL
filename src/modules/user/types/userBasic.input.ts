import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UserBasicInputs {
  @Field()
  id: string;

  @Field()
  email?: string;
}
