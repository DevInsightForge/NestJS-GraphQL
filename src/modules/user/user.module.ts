import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";
import UserHelper from "./user.helper";
import UserResolver from "./user.resolver";
import UserService from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [UserService, UserResolver, UserHelper],
})
export default class UserModule {}
