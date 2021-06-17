import * as mysql2 from "mysql2";
import { FieldPacket, QueryError } from "mysql2";
import { DatabaseConfig } from "../model/configurationModel";
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
  callBack?: (err: QueryError | null, result: any, fields: FieldPacket[]) => any
) {
  let connection = mysql2.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: schema,
    port: config.port,
  });
  // debug mode will print sql
  Logger.debug(`${config.name}(${config.host}) -- execSelect: ${sql}`);
  connection.connect();
  connection.query(sql, callBack);
  connection.end();
}

/**
 *
 * @param curVersion current version
 * @param desVersion destination version
 * @returns true if curVersion>=desVersion
 */
export function versionCheck(curVersion: string, desVersion: string): boolean {
  let currentVersions = curVersion.split(".");
  let destinationVersions = desVersion.split(".");
  for (let index = 0; index < destinationVersions.length; index++) {
    if (
      !currentVersions[index] ||
      Number(currentVersions[index]) < Number(destinationVersions[index])
    ) {
      return false;
    } else if (
      Number(currentVersions[index]) > Number(destinationVersions[index])
    ) {
      break;
    }
  }

  return true;
}
