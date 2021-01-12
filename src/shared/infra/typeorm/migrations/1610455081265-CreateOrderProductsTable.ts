import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOrderProductsTable1610455081265
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'ProductForeignKey',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          }),
          new TableForeignKey({
            name: 'OrderForeignKey',
            columnNames: ['order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('orders_products', 'ProductForeignKey');
    await queryRunner.dropForeignKey('orders_products', 'OrderForeignKey');
    await queryRunner.dropTable('orders_products');
  }
}
