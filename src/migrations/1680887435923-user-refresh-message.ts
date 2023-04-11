import { MigrationInterface, QueryRunner } from "typeorm";

export class userRefreshMessage1680887435923 implements MigrationInterface {
  name = "userRefreshMessage1680887435923";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "message" (
                "id" SERIAL NOT NULL,
                "content" character varying NOT NULL,
                "sent_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "date_joined" TIMESTAMP NOT NULL DEFAULT now(),
                "last_login" TIMESTAMP NOT NULL DEFAULT now(),
                "is_active" boolean NOT NULL DEFAULT true,
                "role" character varying NOT NULL DEFAULT 'user',
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "refresh_token" (
                "token" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "browser" character varying NOT NULL,
                "system" character varying NOT NULL,
                "device" character varying NOT NULL,
                "valid_until" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af" PRIMARY KEY ("token")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "refresh_token"
            ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"
        `);
    await queryRunner.query(`
            DROP TABLE "refresh_token"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "message"
        `);
  }
}
