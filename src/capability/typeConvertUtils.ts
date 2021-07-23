import { ConnectionOptions } from "mysql2";
import { DatabaseConfig } from "../model/configurationModel";

/**
 * convert {@link DatabaseConfig} to {@link ConnectionOptions}
 * 
 * @param config {@link DatabaseConfig}
 * @param schema schemaName
 * @returns 
 */
export function convertConnectionOptions(
  config: DatabaseConfig,
  schema: string
): ConnectionOptions {
  let options: ConnectionOptions = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    charset: config.charset,
    localAddress: config.localAddress,
    socketPath: config.socketPath,
    timezone: config.timezone,
    connectTimeout: config.connectTimeout,
    stringifyObjects: config.stringifyObjects,
    insecureAuth: config.insecureAuth,
  };
  options.database = schema;
  return options;
}
