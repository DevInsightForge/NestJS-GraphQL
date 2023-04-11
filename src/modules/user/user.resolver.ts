import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { Request, Response } from "express";
import PaginationArgs from "src/utilities/dto/pagination.args";
import { IsPublic } from "src/utilities/service/authGuard.service";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import JwtTokens from "./types/jwtToken.type";
import UserService from "./user.service";

@Resolver()
export default class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => User)
  userProfile(@Context("userId") userId: string): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Query(() => [RefreshToken])
  userSessions(@Context("userId") userId: string): Promise<RefreshToken[]> {
    return this.usersService.getSessions(userId);
  }

  @Query(() => [User])
  allUsers(@Args() paginationArgs: PaginationArgs): Promise<User[]> {
    return this.usersService.allUsers(paginationArgs);
  }

  @IsPublic()
  @Mutation(() => JwtTokens)
  async login(
    @Args("input") loginInput: LoginInput,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<JwtTokens> {
    const user = await this.usersService.userLogin(loginInput);
    const refreshToken = await this.usersService.generateRefreshToken({
      req,
      user,
    });

    const accessToken = await this.usersService.generateAccessToken(
      refreshToken,
      res
    );

    return {
      refreshToken,
      accessToken,
    };
  }

  @IsPublic()
  @Mutation(() => JwtTokens)
  async register(
    @Args("input")
    registerInput: RegisterInput,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<JwtTokens> {
    const user = await this.usersService.userRegister(registerInput);
    const refreshToken = await this.usersService.generateRefreshToken({
      req,
      user,
    });

    const accessToken = await this.usersService.generateAccessToken(
      refreshToken,
      res
    );

    return {
      refreshToken,
      accessToken,
    };
  }

  @IsPublic()
  @Mutation(() => String, { nullable: true })
  async refreshAccessToken(
    @Args("refreshToken") refreshToken: string,
    @Context("res") res: Response
  ): Promise<string> {
    const accessToken = await this.usersService.generateAccessToken(
      refreshToken,
      res
    );

    return accessToken;
  }
}
