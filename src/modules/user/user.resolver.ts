import { Resolver } from "@nestjs/graphql";
import User from "./models/user.model";
import UserService from "./user.service";

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly usersService: UserService) {}

  //   @Query(() => [User])
  //   users(@Args() usersArgs: UserArgs): Promise<User[]> {
  //     return this.usersService.findAll(usersArgs);
  //   }

  //   @Mutation(() => User)
  //   async addUser(
  //     @Args("newUserData") newUserData: NewUserInput
  //   ): Promise<User> {
  //     const user = await this.usersService.create(newUserData);
  //     this.pubSubService.publish("userAdded", { userAdded: user });
  //     return user;
  //   }
}
