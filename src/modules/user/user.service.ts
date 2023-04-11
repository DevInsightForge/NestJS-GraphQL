import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import type { Request, Response } from "express";
import { GraphQLError } from "graphql";
import PaginationArgs from "src/utilities/dto/pagination.args";
import * as UAParser from "ua-parser-js";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import JwtTokens from "./types/jwtToken.type";

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

  async getUser(userId: string): Promise<User> {
    const user = await User.findOneByOrFail({
      id: userId,
    });
    return user;
  }

  async allUsers({ take, skip }: PaginationArgs): Promise<User[]> {
    const result = await User.find({
      take,
      skip,
      order: { dateJoined: "DESC" },
    });

    return result;
  }

  async getSessions(userId = ""): Promise<RefreshToken[]> {
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

      user.lastLogin = new Date();
      await user.save();

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
    user,
  }: RefreshTokensParams): Promise<JwtTokens> {
    const { browser, os, device } = UAParser(req.headers["user-agent"]);

    let refresh: RefreshToken;
    const refrshExpires = new Date();
    refrshExpires.setDate(refrshExpires.getDate() + 1); // lets set to 1 day for now

    const refreshPayload = {
      browser: `${browser?.name ?? ""} ${browser?.version ?? ""}`,
      system: `${os?.name ?? ""} ${os?.version ?? ""}`,
      device: `${device?.vendor ?? ""} ${device?.model ?? ""}`,
      user: { id: user?.id },
    };

    try {
      refresh = await RefreshToken.findOneByOrFail({
        ...refreshPayload,
      });

      if (!refresh?.isActive) {
        throw new Error();
      }

      refresh.validUntil = refrshExpires;
      await refresh.save();
    } catch (_) {
      refresh = await RefreshToken.create({
        ...refreshPayload,
        validUntil: refrshExpires,
      }).save();
    }

    const accessToken = await this.generateAccessToken(refresh.token);

    return {
      refreshToken: refresh.token,
      accessToken,
    };
  }

  async generateAccessToken(refreshToken: string): Promise<string> {
    const expirationTime = 1 * 60 * 60; // hour * minute * second
    try {
      const refresh = await RefreshToken.findOneByOrFail({
        token: refreshToken,
      });

      if (!refresh?.isActive) {
        throw new Error();
      }

      const accessToken = await this.jwtService.signAsync(
        {
          id: refresh?.user?.id,
          role: refresh?.user?.role,
        },
        {
          expiresIn: expirationTime,
        }
      );

      return accessToken;
    } catch (_) {
      throw new GraphQLError("Refresh token is invalid or has been expired");
    }
  }
}
