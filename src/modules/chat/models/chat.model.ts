import { Field, ID, ObjectType } from "@nestjs/graphql";
import Message from "src/modules/message/models/message.model";
import UserBasic from "src/modules/user/types/userBasic.type";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import User from "../../user/models/user.model";

@ObjectType()
@Entity()
export default class Chat extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field(() => [UserBasic])
  @JoinTable()
  @ManyToMany(() => User, {
    eager: true,
  })
  participants: Relation<User[]>;

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.chat, {
    eager: true,
  })
  messages: Relation<Message[]>;
}
