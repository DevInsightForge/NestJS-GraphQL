import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import PaginationArgs from "../../utilities/dto/pagination.args";
import User from "./models/user.model";
import UserService from "./user.service";

@Resolver()
export default class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => User)
  userProfile(@Context("userId") userId: string): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Query(() => [User])
  allUsers(@Args() paginationArgs: PaginationArgs): Promise<User[]> {
    return this.usersService.allUsers(paginationArgs);
  }
}
