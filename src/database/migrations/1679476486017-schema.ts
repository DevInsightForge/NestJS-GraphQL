import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1679476486017 implements MigrationInterface {
  name = "schema1679476486017";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "recipe" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "description" varchar NOT NULL,
                "creationDate" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "recipe"
        `);
  }
}
