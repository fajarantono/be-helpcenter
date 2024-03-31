import { MigrationInterface, QueryRunner } from "typeorm";

export class Category1711815896526 implements MigrationInterface {
    name = 'Category1711815896526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6b1c6bc5c2fbba874342e58ba67"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "iconId" TO "icon_id"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_4acc05cb7efa59a5018cdd76d39" FOREIGN KEY ("icon_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_4acc05cb7efa59a5018cdd76d39"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "icon_id" TO "iconId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6b1c6bc5c2fbba874342e58ba67" FOREIGN KEY ("iconId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
