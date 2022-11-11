import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class AddStatementSenderId1668169381621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.addColumn(
            'statements', // no da tabela
            new TableColumn({
                name: 'sender_id',
                type: 'uuid',
                isNullable:true
              },),
          );

          await queryRunner.changeColumn('statements', "type", new TableColumn(  {
            name: 'type',
            type: 'enum',
            enum: ['deposit', 'withdraw', 'transfer']
          }));

          const foreignKey = new TableForeignKey({
            name:"FKSenderUser",
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        })
        await queryRunner.createForeignKey("statements", foreignKey)
          

      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.dropForeignKey("statements", "FKSenderUser");
       await queryRunner.dropColumn("statements","sender_id");
       await queryRunner.changeColumn('statements', "type", new TableColumn(  {
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      }));
    }

}
