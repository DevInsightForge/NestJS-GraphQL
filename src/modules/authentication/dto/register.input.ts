import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Length, Matches } from "class-validator";
import { AlreadyExist } from "./register.validators";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @AlreadyExist({ message: "User already exists with this email" })
  email: string;

  @Field()
  @Length(8, 100, {
    message: "Password length must be minimum 8 to maximum 100",
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is too weak",
  })
  password: string;
}
