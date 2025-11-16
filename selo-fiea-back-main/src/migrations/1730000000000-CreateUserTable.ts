import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1730000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        schema: 'dev',
        columns: [
          {
            name: 'id',
            type: 'nvarchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'user'",
          },
          {
            name: 'company',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'bit',
            isNullable: false,
            default: 1,
          },
          {
            name: 'emailVerified',
            type: 'bit',
            isNullable: false,
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            isNullable: false,
            default: 'GETDATE()',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            isNullable: false,
            default: 'GETDATE()',
          },
        ],
      }),
      true,
    );

    // Criar índice único para email
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_users_email ON dev.users(email)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dev.users', true);
  }
}