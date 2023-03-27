import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NewMessageInput {
  @Field()
  content: string;
}
