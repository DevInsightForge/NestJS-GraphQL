import { MigrationInterface, QueryRunner } from "typeorm";

export class userMessage1680890836536 implements MigrationInterface {
  name = "userMessage1680890836536";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "message"
            ADD "userId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "message"
            ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"
        `);
    await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "userId"
        `);
  }
}
