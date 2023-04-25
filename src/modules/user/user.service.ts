import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PaginationArgs } from "../common/dto/pagination.args";
import { User } from "./models/user.model";

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async getUser(userId: string): Promise<User> {
    const user = await User.findOneByOrFail({
      id: userId,
    });
    return user;
  }

  async allUsers({ take, skip }: PaginationArgs): Promise<User[]> {
    const result = await User.find({
      take,
      skip,
      order: { dateJoined: "DESC" },
    });

    return result;
  }
}
