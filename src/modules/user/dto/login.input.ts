import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export default class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
