import { Field, ID, ObjectType } from "@nestjs/graphql";
import Chat from "src/modules/chat/models/chat.model";
import UserBasic from "src/modules/user/types/userBasic.type";
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

@ObjectType({ description: "message model" })
@Entity()
export default class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @CreateDateColumn({ name: "sent_at" })
  sentAt: Date;

  @Field(() => UserBasic)
  @JoinTable()
  @ManyToOne(() => User, (user) => user.messages, {
    cascade: true,
    eager: true,
  })
  user: Relation<User>;

  // @Field(() => [Message])
  @JoinTable()
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Relation<Chat>;
}
