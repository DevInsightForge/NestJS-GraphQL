import { MigrationInterface, QueryRunner } from "typeorm";

export class chatMessageUser1681195936471 implements MigrationInterface {
    name = 'chatMessageUser1681195936471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_participants_user" ("chatId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_5dfe15692e289461b16eb668e68" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5a65f083b45e9a271fc862c34f" ON "chat_participants_user" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c4f8082e87de9b6f0b65c21f1" ON "chat_participants_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD "chatId" uuid`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants_user" ADD CONSTRAINT "FK_5a65f083b45e9a271fc862c34ff" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_participants_user" ADD CONSTRAINT "FK_3c4f8082e87de9b6f0b65c21f18" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_participants_user" DROP CONSTRAINT "FK_3c4f8082e87de9b6f0b65c21f18"`);
        await queryRunner.query(`ALTER TABLE "chat_participants_user" DROP CONSTRAINT "FK_5a65f083b45e9a271fc862c34ff"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chatId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c4f8082e87de9b6f0b65c21f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a65f083b45e9a271fc862c34f"`);
        await queryRunner.query(`DROP TABLE "chat_participants_user"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
