import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { PaginationArgs } from "../common/dto/pagination.args";
import { NewMessageInput } from "./dto/new-message.input";
import { MessageService } from "./message.service";
import { Message } from "./models/message.model";

@Resolver()
export class MessageResolver {
  constructor(
    private readonly messagesService: MessageService,
    private readonly pubSubService: PubSub
  ) {}

  @Query(() => [Message])
  async chatMessages(
    @Args("chatId") chatId: string,
    @Args() paginationArgs: PaginationArgs
  ): Promise<Message[]> {
    return this.messagesService.findAll(paginationArgs, chatId);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args("newMessageData") newMessageData: NewMessageInput,
    @Context("userId") userId: string
  ): Promise<Message> {
    const message = await this.messagesService.create(newMessageData, userId);
    await this.pubSubService.publish(newMessageData?.chatId, {
      newChatMessage: message,
    });
    return message;
  }

  @Mutation(() => Boolean)
  async deleteMessage(
    @Args("messageId") messageId: string,
    @Context("userId") userId: string
  ) {
    return this.messagesService.delete(messageId, userId);
  }

  @Subscription(() => Message)
  newChatMessage(@Args("chatId") chatId: string) {
    return this.pubSubService.asyncIterator(chatId);
  }
}
