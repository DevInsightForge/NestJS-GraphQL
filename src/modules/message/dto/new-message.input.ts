import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class NewMessageInput {
  @Field()
  content: string;

  @Field()
  chatId: string;
}
