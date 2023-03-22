import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType({ description: "recipe " })
@Entity()
export class Recipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field()
  @CreateDateColumn()
  creationDate: Date;
}
