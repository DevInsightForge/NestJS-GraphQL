import { Injectable } from "@nestjs/common";
import PaginationArgs from "src/utilities/dto/pagination.args";
import NewMessageInput from "./dto/new-message.input";
import Message from "./models/message.model";

@Injectable()
export default class MessageService {
  async findAll(
    { take, skip }: PaginationArgs,
    chatId: string
  ): Promise<Message[]> {
    const result = await Message.find({
      take,
      skip,
      order: { id: "DESC" },
      where: {
        chat: {
          id: chatId,
        },
      },
    });

    return result.reverse();
  }

  async create(
    { content, chatId }: NewMessageInput,
    userId: string
  ): Promise<Message> {
    const { id } = await Message.create({
      content,
      chat: {
        id: chatId,
      },
      user: { id: userId },
    }).save();

    return Message.findOneBy({
      id,
    });
  }

  async delete(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = await Message.findOneByOrFail({
        id: messageId,
        user: {
          id: userId,
        },
      });

      await message.remove();
      return true;
    } catch (_) {
      throw new Error(`Could not find or delete message with id ${messageId}`);
    }
  }
}
