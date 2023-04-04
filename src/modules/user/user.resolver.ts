import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { Request, Response } from "express";
import { IsPublic } from "src/utilities/service/authGuard.service";
import parseAuthCookies from "src/utilities/tools/parseAuthCookies";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import UserArgs from "./dto/user.args";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import UserService from "./user.service";

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => [User])
  allUsers(@Args() usersArgs: UserArgs): Promise<User[]> {
    return this.usersService.allUsers(usersArgs);
  }

  @Query(() => [RefreshToken])
  userSessions(@Context("userId") userId: string): Promise<RefreshToken[]> {
    return this.usersService.getSessions(userId);
  }

  @IsPublic()
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

  @IsPublic()
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

  @IsPublic()
  @Mutation(() => Boolean, { nullable: true })
  async refreshAccessToken(
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<boolean> {
    const { __r_t: refreshToken } = parseAuthCookies(req);
    await this.usersService.generateAccessToken({
      res,
      refreshToken,
    });
    return true;
  }
}
