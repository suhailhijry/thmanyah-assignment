import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Media1756225773037 implements MigrationInterface {
  name = 'Media1756225773037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sources',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'path',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['local', 'url'],
            isNullable: false,
          },
          {
            name: 'origin',
            type: 'enum',
            enum: ['youtube'],
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'sources',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['video', 'audio'],
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'keywords',
            type: 'json',
            isNullable: true,
            default: '"[]"',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'sourceId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'thumbnailId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'isPublished',
            type: 'tinyint',
            isNullable: false,
            default: true,
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['sourceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sources',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['thumbnailId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sources',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'media_metadata',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'codec',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bitrate',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'mediaId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'media_metadata',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'media_metadata',
      new TableForeignKey({
        columnNames: ['mediaId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'media',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'media_metadata',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.dropForeignKey(
      'media_metadata',
      new TableForeignKey({
        columnNames: ['mediaId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'media',
      }),
    );

    await queryRunner.dropForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['thumbnailId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sources',
      }),
    );

    await queryRunner.dropForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['sourceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sources',
      }),
    );

    await queryRunner.dropForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.dropForeignKey(
      'sources',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.dropTable('media_metadata');
    await queryRunner.dropTable('media');
    await queryRunner.dropTable('sources');
  }
}
