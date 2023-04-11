import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import type { Request, Response } from "express";
import { IsPublic } from "../../utilities/service/authGuard.service";
import AuthenticationService from "./authentication.service";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import RefreshToken from "./models/refreshToken.model";
import JwtTokens from "./types/jwtToken.type";

@Resolver()
export default class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Query(() => [RefreshToken])
  userSessions(@Context("userId") userId: string): Promise<RefreshToken[]> {
    return this.authenticationService.getSessions(userId);
  }

  @IsPublic()
  @Mutation(() => JwtTokens)
  async login(
    @Args("input") loginInput: LoginInput,
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<JwtTokens> {
    const user = await this.authenticationService.userLogin(loginInput);
    const refreshToken = await this.authenticationService.generateRefreshToken({
      req,
      user,
    });

    const accessToken = await this.authenticationService.generateAccessToken(
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
    const user = await this.authenticationService.userRegister(registerInput);
    const refreshToken = await this.authenticationService.generateRefreshToken({
      req,
      user,
    });

    const accessToken = await this.authenticationService.generateAccessToken(
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
    const accessToken = await this.authenticationService.generateAccessToken(
      refreshToken,
      res
    );

    return accessToken;
  }
}
