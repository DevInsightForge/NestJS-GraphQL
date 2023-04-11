import { ObjectType, PickType } from "@nestjs/graphql";
import Chat from "../models/chat.model";

@ObjectType()
export default class ChatBasic extends PickType(Chat, [
  "id",
  "title",
  "createdAt",
] as const) {}
