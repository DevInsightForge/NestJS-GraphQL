import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { GraphQLError } from "graphql";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import User from "./models/user.model";

@Injectable()
export default class UserService {
  async userLogin({ email, password }: LoginInput): Promise<User> {
    try {
      const user = await User.findOneByOrFail({
        email,
      });

      if (!(await compare(password, user?.password))) {
        throw new Error("Invalid password");
      }

      return user;
    } catch ({ message }) {
      throw new GraphQLError(message as string);
    }
  }

  async userRegister({ email, password }: RegisterInput) {
    try {
      const hashedPassword = await hash(password, 12);

      const user = await User.create({
        email,
        password: hashedPassword,
      }).save();

      return user;
    } catch ({ message }) {
      throw new GraphQLError(message as string);
    }
  }
}
