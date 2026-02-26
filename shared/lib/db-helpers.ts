import { DataSource, EntityMetadata } from 'typeorm';
import { difference } from 'lodash';

export async function clearTestDataFromDatabase(
  dataSource: DataSource,
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const entityTableNames: string[] = dataSource.entityMetadatas
      .filter(
        (entityMetadata: EntityMetadata) =>
          entityMetadata.tableType === 'regular' ||
          entityMetadata.tableType === 'junction',
      )
      .map((entityMetadata: EntityMetadata) => entityMetadata.tableName);

    // Remove data_version table from the entityTableNames to avoid dropping it
    const idx = entityTableNames.indexOf('configuration_params');
    if (idx > -1) {
      entityTableNames.splice(idx, 1);
    }

    if (entityTableNames.length > 0) {
      const tableList = entityTableNames.map((t) => `"${t}"`).join(', ');
      await queryRunner.query(`TRUNCATE TABLE ${tableList} CASCADE`);
    }
    entityTableNames.push('configuration_params');
    entityTableNames.push(dataSource.metadataTableName);
    entityTableNames.push(
      dataSource.options.migrationsTableName || 'migrations',
    );
    entityTableNames.push('spatial_ref_sys');

    const databaseTableNames: string[] = (
      await dataSource.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`,
      )
    ).map((e: Record<string, any>) => e.table_name);

    const tablesToDrop = difference(databaseTableNames, entityTableNames);

    await Promise.all(
      tablesToDrop.map((tableToDrop: string) =>
        queryRunner.dropTable(tableToDrop),
      ),
    );
    await queryRunner.commitTransaction();
  } catch (err) {
    // rollback changes before throwing error
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // release query runner which is manually created
    await queryRunner.release();
  }
}
