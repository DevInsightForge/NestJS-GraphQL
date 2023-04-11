import { Field, InputType } from "@nestjs/graphql";
import UserBasicInputs from "src/modules/user/types/userBasic.input";

@InputType()
export default class NewChatInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  participants: UserBasicInputs[];
}
