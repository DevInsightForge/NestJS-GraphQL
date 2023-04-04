import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import UserResolver from "./user.resolver";
import UserService from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("SECRET", "DEFAULTJWTSECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, UserResolver],
})
export default class UserModule {}
