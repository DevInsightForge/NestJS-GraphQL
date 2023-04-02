import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcryptjs";
import type { Request, Response } from "express";
import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import * as parser from "ua-parser-js";
import LoginInput from "./dto/login.input";
import RegisterInput from "./dto/register.input";
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
  constructor(private configService: ConfigService) {}

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
    const refrshExpires = moment().add(7, "days").toDate();
    const { browser, os, device } = parser(req.headers["user-agent"]);

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
    try {
      const refreshTokenData = await RefreshToken.findOneBy({
        token: refreshToken,
      });

      if (!refreshTokenData) {
        throw Error("Invalid refresh token");
      }

      if (!refreshTokenData.isActive) {
        throw Error("Token has expired");
      }

      const accessToken = jwt.sign(
        {
          // id: refreshTokenData?.user.id,
          // role: refreshTokenData?.user.role,
        },
        this.configService.get("SECRET", "DEFAULTJWTSECRET"),
        {
          expiresIn: "1h",
        }
      );
      const accessExpires = moment().add(1, "hours").toDate();

      res?.cookie("__a_t", accessToken, {
        expires: accessExpires,
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
