import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import User from "../../user/models/user.model";

@ObjectType()
@Entity({ name: "refresh_token" })
export default class RefreshToken extends BaseEntity {
  @HideField()
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn("uuid")
  token: string;

  @JoinTable()
  @HideField()
  @ManyToOne(() => User, (user) => user.sessions, {
    cascade: true,
    eager: true,
  })
  user: Relation<User>;

  @Field()
  @Column()
  browser: string;

  @Field()
  @Column()
  system: string;

  @Field()
  @Column()
  device: string;

  @HideField()
  @CreateDateColumn({ name: "valid_until" })
  validUntil: Date;

  @Field(() => Boolean, { nullable: true })
  get isActive(): boolean {
    return Boolean(this.validUntil.getTime() > new Date().getTime());
  }
}
