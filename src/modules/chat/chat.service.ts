import { Injectable } from "@nestjs/common";
import { PaginationArgs } from "../../utilities/dto/pagination.args";
import { NewChatInput } from "./dto/new-chat.input";
import { Chat } from "./models/chat.model";
import { ChatBasic } from "./types/chatBasic.type";

@Injectable()
export class ChatService {
  async findAll(
    { take, skip }: PaginationArgs,
    userId: string
  ): Promise<ChatBasic[]> {
    const result = await Chat.find({
      take,
      skip,
      order: { id: "DESC" },
      where: {
        participants: {
          id: userId,
        },
      },
    });

    return result;
  }

  async getChat(chatId: string): Promise<Chat> {
    const chat = await Chat.findOneOrFail({
      where: {
        id: chatId,
      },
    });

    return chat;
  }

  async create(
    { participants = [], ...chatInputs }: NewChatInput,
    userId: string
  ): Promise<ChatBasic> {
    if (!participants?.find((user) => user?.id === userId)) {
      participants.unshift({
        id: userId,
      });
    }

    const chat = await Chat.create({
      ...chatInputs,
      participants,
    }).save();
    return chat;
  }

  async delete(chatId: string, userId: string): Promise<boolean> {
    try {
      const chat = await Chat.findOneByOrFail({
        id: chatId,
        participants: {
          id: userId,
        },
      });

      await chat.remove();
      return true;
    } catch (_) {
      throw new Error(`Could not find or delete chat with id ${chatId}`);
    }
  }
}
