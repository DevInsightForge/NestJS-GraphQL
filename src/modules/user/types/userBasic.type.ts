import { ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../models/user.model";

@ObjectType()
export class UserBasic extends PickType(User, ["id", "email"] as const) {}
