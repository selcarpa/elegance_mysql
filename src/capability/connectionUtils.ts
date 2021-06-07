import { DatabaseConfig } from "./configurationService";
import * as mysql2 from "mysql2";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { FieldPacket } from "mysql2";
import { Logger } from "./logService";

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
  callBack?: (
    err: Query.QueryError | null,
    result: any,
    fields: FieldPacket[]
  ) => any
) {
  let connection = mysql2.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: schema,
  });
  Logger.debug(sql);
  connection.connect();
  connection.query(sql, callBack);
  connection.end();
}
