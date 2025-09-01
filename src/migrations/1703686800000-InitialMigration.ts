import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InitialMigration1703686800000 implements MigrationInterface {
  name = 'InitialMigration1703686800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "color" character varying NOT NULL DEFAULT '#007bff',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "notes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "archived" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notes_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "note_categories" (
        "note_id" uuid NOT NULL,
        "category_id" integer NOT NULL,
        CONSTRAINT "PK_note_categories" PRIMARY KEY ("note_id", "category_id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_note_categories_note_id" ON "note_categories" ("note_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_note_categories_category_id" ON "note_categories" ("category_id");
    `);

    await queryRunner.query(`
      ALTER TABLE "note_categories" 
      ADD CONSTRAINT "FK_note_categories_note_id" 
      FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE "note_categories" 
      ADD CONSTRAINT "FK_note_categories_category_id" 
      FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryRunner.query(`
      INSERT INTO "users" ("username", "password", "isActive") 
      VALUES ('admin', $1, true);
    `, [hashedPassword]);

    await queryRunner.query(`
      INSERT INTO "categories" ("name", "description", "color") VALUES
      ('Trabajo', 'Notas relacionadas al trabajo', 'blue'),
      ('Personal', 'Notas personales', 'green'),
      ('Urgente', 'Notas urgentes', 'red'),
      ('Ideas', 'Ideas y lluvia de ideas', 'purple'),
      ('Otro', 'Otras notas', 'gray');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note_categories" DROP CONSTRAINT "FK_note_categories_category_id"`);
    await queryRunner.query(`ALTER TABLE "note_categories" DROP CONSTRAINT "FK_note_categories_note_id"`);
    await queryRunner.query(`DROP INDEX "IDX_note_categories_category_id"`);
    await queryRunner.query(`DROP INDEX "IDX_note_categories_note_id"`);
    await queryRunner.query(`DROP TABLE "note_categories"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}