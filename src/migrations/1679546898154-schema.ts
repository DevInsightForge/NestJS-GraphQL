import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1679546898154 implements MigrationInterface {
  name = "schema1679546898154";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "message" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "creationDate" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "message"
        `);
  }
}
