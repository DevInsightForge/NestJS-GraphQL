import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import type { Request, Response } from "express";
import { GraphQLError } from "graphql";
import { MoreThan } from "typeorm";
import * as UAParser from "ua-parser-js";
import { User } from "../user/models/user.model";
import { LoginInput } from "./dto/login.input";
import { RegisterInput } from "./dto/register.input";
import { RefreshToken } from "./models/refreshToken.model";

interface RefreshTokensParams {
  req?: Request;
  res?: Response;
  user?: User;
}

@Injectable()
export class AuthenticationService {
  isProductionMode: boolean;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.isProductionMode = this.configService.get("NODE_ENV") === "production";
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

  async getSessions(userId = ""): Promise<RefreshToken[]> {
    const sessions = await RefreshToken.findBy({
      user: { id: userId },
      validUntil: MoreThan(new Date()),
    });

    return sessions;
  }

  async generateRefreshToken({
    req,
    user,
  }: RefreshTokensParams): Promise<string> {
    const { browser, os, device } = UAParser(req.headers["user-agent"]);

    let refresh: RefreshToken;
    const refrshExpires = new Date();
    refrshExpires.setDate(refrshExpires.getDate() + 1); // lets set to 1 day for now

    const refreshPayload = {
      browser: `${browser?.name ?? ""}`,
      system: `${os?.name ?? ""}`,
      device: `${device?.vendor ?? ""} ${device?.model ?? ""}`.trim(),
      user: { id: user?.id },
    };

    try {
      refresh = await RefreshToken.findOneByOrFail({
        ...refreshPayload,
        validUntil: MoreThan(new Date()),
      });

      refresh.validUntil = refrshExpires;
      await refresh.save();
    } catch (_) {
      refresh = await RefreshToken.create({
        ...refreshPayload,
        validUntil: refrshExpires,
      }).save();
    }

    return refresh.token;
  }

  async generateAccessToken(
    refreshToken: string,
    res?: Response
  ): Promise<string> {
    const expirationTime = 1 * 60 * 60; // hour * minute * second
    try {
      const refresh = await RefreshToken.findOneByOrFail({
        token: refreshToken,
        validUntil: MoreThan(new Date()),
      });

      const accessToken = await this.jwtService.signAsync(
        {
          id: refresh?.user?.id,
          role: refresh?.user?.role,
        },
        {
          expiresIn: expirationTime,
        }
      );

      res?.cookie("Bearer", accessToken, {
        maxAge: expirationTime * 1000, // expirationTime * milisecond
        path: "/graphql",
        httpOnly: true,
        secure: this.isProductionMode,
        sameSite: this.isProductionMode ? "none" : "lax",
      });

      return accessToken;
    } catch (_) {
      throw new GraphQLError("Refresh token is invalid or has been expired");
    }
  }

  async removeTokenCookie(refreshToken: string, res?: Response): Promise<void> {
    const refresh = await RefreshToken.findOneByOrFail({ token: refreshToken });
    refresh.validUntil = new Date();
    await refresh.save();

    res?.cookie("Bearer", "", {
      maxAge: 0, // expirationTime * milisecond
      path: "/graphql",
      httpOnly: true,
      secure: this.isProductionMode,
      sameSite: this.isProductionMode ? "none" : "lax",
    });
  }
}
