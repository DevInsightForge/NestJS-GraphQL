import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1679978528596 implements MigrationInterface {
  name = "schema1679978528596";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "message" (
                "id" SERIAL NOT NULL,
                "content" character varying NOT NULL,
                "sent_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "message"
        `);
  }
}
