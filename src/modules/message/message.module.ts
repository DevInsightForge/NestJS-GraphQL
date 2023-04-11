import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import PubSubModule from "../../utilities/modules/pubsub.module";
import MessageResolver from "./message.resolver";
import MessageService from "./message.service";
import Message from "./models/message.model";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), PubSubModule],
  providers: [MessageResolver, MessageService],
})
export default class MessageModule {}
