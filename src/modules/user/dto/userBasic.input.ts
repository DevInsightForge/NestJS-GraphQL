import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserBasicInputs {
  @Field()
  id: string;

  @Field()
  email?: string;
}
