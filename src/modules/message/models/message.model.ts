import { Field, HideField, ID, ObjectType } from "@nestjs/graphql";
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
import { Chat } from "../../chat/models/chat.model";
import { User } from "../../user/models/user.model";
import { UserBasic } from "../../user/types/userBasic.type";

@ObjectType({ description: "message model" })
@Entity()
export class Message extends BaseEntity {
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
  @ManyToOne(() => User, {
    cascade: true,
    eager: true,
  })
  user: Relation<User>;

  @HideField()
  @JoinTable()
  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: "CASCADE",
  })
  chat: Relation<Chat>;
}
