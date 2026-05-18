import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWatchlistItems1700000000000 implements MigrationInterface {
  name = 'CreateWatchlistItems1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "watchlist_items" (
        "id"         UUID              NOT NULL DEFAULT gen_random_uuid(),
        "flight_number" VARCHAR(16)    NOT NULL,
        "departure_airport" VARCHAR(8) NOT NULL,
        "departure_date"    DATE       NOT NULL,
        "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_watchlist_items" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_watchlist_flight" UNIQUE ("flight_number", "departure_date")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "watchlist_items"`);
  }
}
