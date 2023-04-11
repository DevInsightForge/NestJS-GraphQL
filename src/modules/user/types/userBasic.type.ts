import { ObjectType, PickType } from "@nestjs/graphql";
import User from "../models/user.model";

@ObjectType()
export default class UserBasic extends PickType(User, [
  "id",
  "email",
] as const) {}
