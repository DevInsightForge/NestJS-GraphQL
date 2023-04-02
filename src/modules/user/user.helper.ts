/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import moment from "moment";
import parser from "ua-parser-js";
import RefreshToken from "./models/refreshToken.model";
import type User from "./models/user.model";

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
export default class UserHelper {
  constructor(private configService: ConfigService) {}

  generateAccessToken = async ({
    res,
    refreshToken,
  }: AccessTokensParams): Promise<string> => {
    const isProd = this.configService.get("NODE_ENV") === "production";
    try {
      const refreshTokenData = await RefreshToken.findOneByOrFail({
        token: refreshToken,
      });

      if (!refreshTokenData.isActive) {
        throw Error("Token expired!");
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

      return accessToken;
    } catch (error) {
      throw new GraphQLError("Something went wrong", {
        extensions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error,
        },
      });
    }
  };

  generateRefreshToken = async ({
    req,
    res,
    user,
  }: RefreshTokensParams): Promise<string> => {
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

    return refreshToken.token;
  };
}
