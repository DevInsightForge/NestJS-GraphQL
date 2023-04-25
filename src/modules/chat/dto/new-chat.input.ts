import { Field, InputType } from "@nestjs/graphql";
import { UserBasicInputs } from "../../user/dto/userBasic.input";

@InputType()
export class NewChatInput {
  @Field()
  title: string;

  @Field(() => [UserBasicInputs], { nullable: true })
  participants: UserBasicInputs[];
}
