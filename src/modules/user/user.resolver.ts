import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import type { Request, Response } from "express";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import User from "./models/user.model";
import UserHelper from "./user.helper";
import UserService from "./user.service";

@Resolver(() => User)
export default class UserResolver {
  constructor(
    private readonly usersService: UserService,
    private readonly userHelper: UserHelper
  ) {}

  //   @Query(() => [User])
  //   users(@Args() usersArgs: UserArgs): Promise<User[]> {
  //     return this.usersService.findAll(usersArgs);
  //   }

  @Mutation(() => User, { nullable: true })
  async login(
    @Args("input") loginInput: LoginInput,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<User> {
    const user = await this.usersService.userLogin(loginInput);
    await this.userHelper.generateRefreshToken({
      req,
      res,
      user,
    });

    return user;
  }

  @Mutation(() => User, { nullable: true })
  async register(
    @Args("input")
    registerInput: RegisterInput,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<User> {
    const user = await this.usersService.userRegister(registerInput);
    await this.userHelper.generateRefreshToken({
      req,
      res,
      user,
    });

    return user;
  }
}
