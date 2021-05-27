import { EleganceTreeItem } from "./eleganceDatabaseProvider";
import * as mysql from "mysql";

export function select500(item: EleganceTreeItem): void {
  let connection = mysql.createConnection({
    host: item.config.host,
    user: item.config.user,
    password: item.config.password,
    database: "mysql",
  });

  let sql: string = `select * from \`${item.result.schemaName}\`.\`${item.result.tableName}\` limit 500`;
  console.log(sql);

  let promise = new Promise<Array<EleganceTreeItem>>((resolve) => {
    connection.query(
      sql,
      (
        error: mysql.MysqlError,
        results: Array<any>,
        fields: mysql.FieldInfo[]
      ) => {
        if (error) {
          console.error(error.message);
          throw error;
        }
        let sonTreeItems: EleganceTreeItem[] = [];
        results.forEach((result) => {
          console.log(result);
        });
        resolve(sonTreeItems);
      }
    );
  });
  connection.end();
}
