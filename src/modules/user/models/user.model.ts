import {
  Field,
  HideField,
  ID,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import RefreshToken from "./refreshToken.model";

export enum UserRole {
  superadmin = "superadmin",
  admin = "admin",
  user = "user",
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "User role that controls user permissions",
});

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @HideField()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Field()
  @CreateDateColumn({ name: "date_joined" })
  dateJoined: Date;

  @Field()
  @CreateDateColumn({ name: "last_login" })
  lastLogin: Date;

  @Field()
  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Field(() => [RefreshToken], { nullable: true })
  @OneToMany(() => RefreshToken, (token) => token.user, {
    eager: true,
  })
  sessions: RefreshToken[];

  @Field(() => UserRole)
  @Column({ default: UserRole.user })
  role: UserRole;

  @Field(() => Boolean, { nullable: true })
  get isSuperadmin(): boolean {
    return Boolean(this.role === UserRole.superadmin);
  }

  @Field(() => Boolean, { nullable: true })
  get isAdmin(): boolean {
    return Boolean(this.role === UserRole.admin);
  }
}
