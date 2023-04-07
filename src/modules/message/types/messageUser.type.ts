import { ObjectType, PickType } from "@nestjs/graphql";
import User from "../../user/models/user.model";

@ObjectType()
export default class MessageUser extends PickType(User, ["id"] as const) {}
