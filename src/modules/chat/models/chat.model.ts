import { Field, ID, ObjectType } from "@nestjs/graphql";
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
import { Message } from "../../message/models/message.model";
import { User } from "../../user/models/user.model";
import { UserBasic } from "../../user/types/userBasic.type";

@ObjectType()
@Entity()
export class Chat extends BaseEntity {
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
