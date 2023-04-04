import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import type { Request, Response } from "express";
import { GraphQLError } from "graphql";
import * as UAParser from "ua-parser-js";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import UserArgs from "./dto/user.args";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";

interface AccessTokensParams {
  res?: Response;
  refreshToken?: string;
}
interface RefreshTokensParams {
  req?: Request;
  res?: Response;
  user?: User;
}

@Injectable()
export default class UserService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async allUsers({ take, skip }: UserArgs): Promise<User[]> {
    const result = await User.find({
      take,
      skip,
      order: { dateJoined: "DESC" },
    });

    return result;
  }

  async getSessions(userId: string): Promise<RefreshToken[]> {
    const sessions = await RefreshToken.findBy({
      user: { id: userId },
    });
    return sessions;
  }

  async userLogin({ email, password }: LoginInput): Promise<User> {
    try {
      const user = await User.findOneByOrFail({
        email,
      });

      if (!(await compare(password, user?.password))) {
        throw new Error("Invalid login credentials");
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

  async generateRefreshToken({
    req,
    res,
    user,
  }: RefreshTokensParams): Promise<void> {
    const isProd = this.configService.get("NODE_ENV") === "production";
    const { browser, os, device } = UAParser(req.headers["user-agent"]);

    const refrshExpires = new Date();
    refrshExpires.setDate(refrshExpires.getDay() + 7);

    const refreshPayload = {
      browser: `${browser?.name ?? ""} ${browser?.version ?? ""}`,
      system: `${os?.name ?? ""} ${os?.version ?? ""}`,
      device: `${device?.vendor ?? ""} ${device?.model ?? ""}`,
      user: { id: user?.id },
    };

    let refreshToken: RefreshToken;
    try {
      refreshToken = await RefreshToken.findOneByOrFail({ ...refreshPayload });

      refreshToken.validUntil = refrshExpires;
      await refreshToken.save();
    } catch (_) {
      refreshToken = await RefreshToken.create({
        ...refreshPayload,
        validUntil: refrshExpires,
      }).save();
    }

    res?.cookie("__r_t", refreshToken.token, {
      expires: refrshExpires,
      path: "/graphql",
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    await this.generateAccessToken({ res, refreshToken: refreshToken.token });
  }

  async generateAccessToken({
    res,
    refreshToken,
  }: AccessTokensParams): Promise<void> {
    const isProd = this.configService.get("NODE_ENV") === "production";
    const expirationTime = 1 * 60 * 60; // hour * minute * second
    try {
      const refreshTokenData = await RefreshToken.findOneBy({
        token: refreshToken,
      });

      if (!refreshTokenData?.isActive) {
        throw Error("Token is invalid or has been expired");
      }

      const accessToken = await this.jwtService.signAsync(
        {
          id: refreshTokenData?.user?.id,
          role: refreshTokenData?.user?.role,
        },
        {
          expiresIn: expirationTime,
        }
      );

      res?.cookie("__a_t", accessToken, {
        maxAge: expirationTime * 1000, // expirationTime * milisecond
        path: "/graphql",
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });
    } catch ({ message }) {
      throw new GraphQLError(message as string);
    }
  }
}
