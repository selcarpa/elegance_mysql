import { DatabaseConfig } from "./configurationReader";
import * as mysql from "mysql";

/**
 *
 * @param config database config of this item
 * @param schema schema used
 * @param sql sql to execute
 * @param callBack callback
 */
export function execSelect(
  config: DatabaseConfig,
  schema: string,
  sql: string,
  callBack: mysql.queryCallback
) {
  let connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: schema,
  });
  connection.connect();
  connection.query(sql, callBack);
  connection.end();
}
