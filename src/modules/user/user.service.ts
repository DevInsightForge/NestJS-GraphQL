import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import LoginInput from "./dto/login.input";
import User from "./models/user.model";

@Injectable()
export default class UserService {
  async userLogin({ email, password }: LoginInput): Promise<User> {
    try {
      const user = await User.findOneByOrFail({
        email,
      });

      if (!(await bcrypt.compare(password, user?.password))) {
        throw new Error("Invalid password");
      }

      return user;
    } catch ({ message }) {
      throw new GraphQLError(message as string);
    }
  }
}
