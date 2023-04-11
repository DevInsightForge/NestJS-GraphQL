import { Field, InputType } from "@nestjs/graphql";
import UserBasicInputs from "../../user/dto/userBasic.input";

@InputType()
export default class NewChatInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  participants: UserBasicInputs[];
}
