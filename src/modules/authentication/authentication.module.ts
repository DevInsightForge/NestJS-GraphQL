import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";
import { RefreshToken } from "./models/refreshToken.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("SECRET", "DEFAULTJWTSECRET"),
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [AuthenticationService, AuthenticationResolver],
})
export class AuthenticationModule {}
