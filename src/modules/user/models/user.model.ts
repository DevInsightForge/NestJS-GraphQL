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
  Relation,
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

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ name: "date_joined" })
  dateJoined: Date;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ name: "last_login" })
  lastLogin: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Field(() => UserRole, { nullable: true })
  @Column({ default: UserRole.user })
  role: UserRole;

  // @Field(() => [RefreshToken], { nullable: true })
  @HideField()
  @OneToMany(() => RefreshToken, (token) => token.user, {
    eager: true,
  })
  sessions: Relation<RefreshToken[]>;

  @Field(() => Boolean, { nullable: true })
  get isSuperadmin(): boolean {
    return Boolean(this.role === UserRole.superadmin);
  }

  @Field(() => Boolean, { nullable: true })
  get isAdmin(): boolean {
    return Boolean(this.role === UserRole.admin);
  }
}
