import { Field, ID, ObjectType } from "@nestjs/graphql";
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
import MessageUser from "../types/messageUser.type";

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

  @Field(() => MessageUser)
  @JoinTable()
  @ManyToOne(() => User, (user) => user.messages, {
    cascade: true,
    eager: true,
  })
  user: Relation<User>;
}
