import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import type { Request, Response } from "express";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import User from "./models/user.model";
import UserService from "./user.service";

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly usersService: UserService) {}

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
    await this.usersService.generateRefreshToken({
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
    await this.usersService.generateRefreshToken({
      req,
      res,
      user,
    });

    return user;
  }

  @Mutation(() => Boolean, { nullable: true })
  async refreshAccessToken(
    @Args("refreshToken")
    refreshToken: string,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<boolean> {
    await this.usersService.generateAccessToken({
      res,
      refreshToken,
    });
    return true;
  }
}
