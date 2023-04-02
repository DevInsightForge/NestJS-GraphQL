import { Field, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  //   OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity({ name: "refresh_token" })
export default class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  token: string;

  // @JoinTable()
  // @ManyToOne(() => User, (user) => user.sessions, {
  //   cascade: true,
  // })
  // user: User;

  @Field()
  @Column()
  browser: string;

  @Field()
  @Column()
  system: string;

  @Field()
  @Column()
  device: string;

  @CreateDateColumn({ name: "valid_until" })
  validUntil: Date;

  @Field(() => Boolean, { nullable: true })
  get isActive(): boolean {
    return Boolean(this.validUntil.getTime() > new Date().getTime());
  }
}
