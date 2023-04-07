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
import User from "../../modules/user/models/user.model";

const IS_PUBLIC_KEY = "isPublic";
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export default class AuthGuardService implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

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

    const token = this.extractTokenFromHeader(ctx.req);

    if (!token) {
      throw new GraphQLError("Forbidden resource", {
        extensions: { code: "FORBIDDEN" },
      });
    }
    try {
      const payload: Partial<User> = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("SECRET", "DEFAULTJWTSECRET"),
      });
      ctx.userId = payload?.id;
      ctx.userRole = payload.role;
    } catch {
      throw new GraphQLError("Invalid token", {
        extensions: { code: "FORBIDDEN" },
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type = null, token = null] =
      request?.headers?.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
