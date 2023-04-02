import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import UserResolver from "./user.resolver";
import UserService from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [UserService, UserResolver],
})
export default class UserModule {}
