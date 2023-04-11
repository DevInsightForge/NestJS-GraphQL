import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PubSubModule } from "../../utilities/modules/pubsub.module";
import { ChatResolver } from "./chat.resolver";
import { ChatService } from "./chat.service";
import { Chat } from "./models/chat.model";

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), PubSubModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
