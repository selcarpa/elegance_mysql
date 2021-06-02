import { DatabaseConfig } from "./configurationReader";
import * as mysql from "mysql";

export interface OnResult {
  (): Promise<Array<any>>;
}

export function execSelect(
  sql: string,
  database: string,
  config: DatabaseConfig,
  onSuccess: OnResult
) {
  let connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: database,
  });
  let promise = new Promise<Array<string>>((resolve) => {
    connection.query(
      sql,
      (
        error: mysql.MysqlError,
        results: Array<any>,
        fields: mysql.FieldInfo[]
      ) => {
          
      }
    );
  });
}
