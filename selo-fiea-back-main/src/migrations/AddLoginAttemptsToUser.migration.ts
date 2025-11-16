import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLoginAttemptsToUser1730200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'failedLoginAttempts',
        type: 'int',
        isNullable: false,
        default: 0,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lockedUntil',
        type: 'datetime',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lockedUntil');
    await queryRunner.dropColumn('users', 'failedLoginAttempts');
  }
}
