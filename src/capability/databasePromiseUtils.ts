import { createConnection } from "mysql2/promise";
import { DatabaseConfig } from "../model/configurationModel";
import { convertConnectionOptions } from "./typeConvertUtils";

/**
 * get database connection
 *
 * @param config @see DatabaseConfig
 * @param schema schema name
 * @returns
 */
export async function getConnectionPromise(
  config: DatabaseConfig,
  schema: string
) {
  return await createConnection(convertConnectionOptions(config, schema));
}
