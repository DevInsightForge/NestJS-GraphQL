import { Injectable } from "@nestjs/common";
import PaginationArgs from "src/utilities/dto/pagination.args";
import NewMessageInput from "./dto/new-message.input";
import Message from "./models/message.model";

@Injectable()
export default class MessageService {
  async create(data: NewMessageInput, userId: string): Promise<Message> {
    return Message.create({ ...data, user: { id: userId } }).save();
  }

  async findOneById(id: string): Promise<Message> {
    return Message.findOneByOrFail({ id });
  }

  async findAll({ take, skip }: PaginationArgs): Promise<Message[]> {
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
