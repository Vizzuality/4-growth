import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectionTypesTable1763718171484
  implements MigrationInterface
{
  name = 'AddProjectionTypesTable1763718171484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the projection_types table using the existing projections_type_enum
    await queryRunner.query(
      `CREATE TABLE "projection_types" ("id" "public"."projections_type_enum" NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_f2e9b6c461851397914438c0d7f" PRIMARY KEY ("id"))`,
    );

    // Populate projection_types table with seed data before adding FK constraint
    await queryRunner.query(`
      INSERT INTO "projection_types" ("id", "description") VALUES
      ('market-potential', 'Market Potential represents the total potential market size for a given technology, application, or segment.'),
      ('addressable-market', 'Addressable Market represents the portion of the market potential that can realistically be addressed or captured.'),
      ('penetration', 'Penetration measures the percentage of the addressable market that has been captured or is expected to be captured.'),
      ('shipments', 'Shipments represents the number of units shipped or delivered during a specific time period.'),
      ('installed-base', 'Installed Base represents the total number of units currently in use or installed in the market.'),
      ('prices', 'Prices represents the average selling prices or price trends for products or services in the market.'),
      ('revenues', 'Revenues represents the total revenue generated or projected to be generated from sales in the market.')
    `);

    // Add foreign key constraint from projections.type to projection_types.id
    await queryRunner.query(
      `ALTER TABLE "projections" ADD CONSTRAINT "FK_6d1373264864e992632cbbee14f" FOREIGN KEY ("type") REFERENCES "projection_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "projections" DROP CONSTRAINT "FK_6d1373264864e992632cbbee14f"`,
    );

    // Drop the projection_types table
    await queryRunner.query(`DROP TABLE "projection_types"`);
  }
}
