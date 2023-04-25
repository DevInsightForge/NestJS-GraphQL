import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { GraphQLError } from "graphql";
import { User } from "../../modules/user/models/user.model";

const IS_PUBLIC_KEY = "isPublic";
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  private extractTokenOrThrow(request: Request): string | undefined {
    const authorizationCookie = request?.headers?.cookie
      ?.split(`; `)
      ?.find((item: string) => item?.startsWith("Bearer="));

    const [type = "", accessToken = undefined] =
      request?.headers?.authorization?.split(" ") ??
      authorizationCookie?.split("=") ??
      [];

    if (type !== "Bearer" && !accessToken) {
      throw new GraphQLError("You are not authorized for this operation", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    return accessToken;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const ctx: ContextType = gqlCtx.getContext();
    const token = this.extractTokenOrThrow(ctx?.req);

    try {
      const payload: Partial<User> = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("SECRET", "DEFAULTJWTSECRET"),
      });
      ctx.userId = payload?.id;
      ctx.userRole = payload.role;
    } catch {
      throw new GraphQLError("Token is invalid or expired", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }
    return true;
  }
}
