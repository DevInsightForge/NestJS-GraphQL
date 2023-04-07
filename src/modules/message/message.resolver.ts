import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import MessageArgs from "./dto/message.args";
import NewMessageInput from "./dto/new-message.input";
import MessageService from "./message.service";
import Message from "./models/message.model";

@Resolver()
export default class MessageResolver {
  constructor(
    private readonly messagesService: MessageService,
    private readonly pubSubService: PubSub
  ) {}

  @Query(() => [Message])
  messages(@Args() messagesArgs: MessageArgs): Promise<Message[]> {
    return this.messagesService.findAll(messagesArgs);
  }

  @Mutation(() => Message)
  async addMessage(
    @Args("newMessageData") newMessageData: NewMessageInput
  ): Promise<Message> {
    const message = await this.messagesService.create(newMessageData);
    await this.pubSubService.publish("messageAdded", { messageAdded: message });
    return message;
  }

  @Mutation(() => Boolean)
  async removeMessage(@Args("id") id: string) {
    return this.messagesService.remove(id);
  }

  @Subscription(() => Message)
  messageAdded() {
    return this.pubSubService.asyncIterator("messageAdded");
  }
}
