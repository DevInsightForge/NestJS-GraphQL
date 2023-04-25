import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { PaginationArgs } from "../common/dto/pagination.args";
import { ChatService } from "./chat.service";
import { NewChatInput } from "./dto/new-chat.input";
import { Chat } from "./models/chat.model";
import { ChatBasic } from "./types/chatBasic.type";

@Resolver()
export class ChatResolver {
  constructor(
    private readonly pubSubService: PubSub,
    private readonly chatService: ChatService
  ) {}

  @Query(() => [ChatBasic])
  myChats(
    @Context("userId") userId: string,
    @Args() paginationArgs: PaginationArgs
  ): Promise<ChatBasic[]> {
    return this.chatService.findAll(paginationArgs, userId);
  }

  @Query(() => Chat)
  getChat(@Args("chatId") chatId: string): Promise<Chat> {
    return this.chatService.getChat(chatId);
  }

  @Mutation(() => ChatBasic)
  createChat(
    @Context("userId") userId: string,
    @Args("input") chatInputs: NewChatInput
  ) {
    return this.chatService.create(chatInputs, userId);
  }

  @Mutation(() => Boolean)
  deleteChat(
    @Args("chatId") chatId: string,
    @Context("userId") userId: string
  ) {
    return this.chatService.delete(chatId, userId);
  }
}
