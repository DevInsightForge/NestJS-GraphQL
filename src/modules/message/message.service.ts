import { Injectable } from "@nestjs/common";
import { MessageArgs } from "./dto/message.args";
import { NewMessageInput } from "./dto/new-message.input";
import { Message } from "./models/message.model";

@Injectable()
export class MessageService {
  async create(data: NewMessageInput): Promise<Message> {
    return await Message.create({ ...data }).save();
  }

  async findOneById(id: string): Promise<Message> {
    return await Message.findOneByOrFail({ id });
  }

  async findAll({ take, skip }: MessageArgs): Promise<Message[]> {
    const result = await Message.find({
      take,
      skip,
      order: { id: "DESC" },
    });

    return result.reverse();
  }

  async remove(id: string): Promise<boolean> {
    await Message.delete({ id });
    return true;
  }
}
