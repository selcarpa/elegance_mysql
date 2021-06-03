import { DatabaseConfig } from "./configurationReader";
import * as mysql from "mysql";

export function execSelect(
  config: DatabaseConfig,
  database: string,
  sql: string,
  callBack: mysql.queryCallback
) {
  let connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: database,
  });
  connection.connect();
  connection.query(
    sql,
    (
      error: mysql.MysqlError,
      results: Array<any>,
      fields: mysql.FieldInfo[]
    ) => {
      callBack(error, results, fields);
    }
  );
  connection.end();
}
