import * as vscode from "vscode";
import { LogLevel } from "./logService";
/**
 * database config model for settings.json
 */
export class DatabaseConfig {
  /*
   * database version, this field init when toggle first layer of database list
   */
  public version?: string;

  /**
   *
   * @param name text to display on first layer of treeview
   * @param host mysql host
   * @param port mysql port
   * @param user mysql user
   * @param password mysql password
   * @param schemaFilterEnable when enable, children of database_tree_item will filter with showSchemas array
   * @param showSchemas for schemaFilterEnable
   */
  constructor(
    public name: string,
    public host: string,
    public port: number,
    public user: string,
    public password: string,
    public schemaFilterEnable: boolean,
    public showSchemas: Array<string>
  ) {}
}

/**
 *
 * @returns elegance.mysql from settings.json
 */
function getConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("elegance.mysql");
}

/**
 * TODO: known issue: other extensions can get this configuration. if there is any malicious extension, it will leak database connection information from settings.json.
 * @returns database configs from settings.json
 */
export function getDatabaseConfigs(): Array<DatabaseConfig> {
  const databases = getConfiguration().get("databases");

  return <Array<DatabaseConfig>>databases;
}

/**
 *
 * @returns log level configs from settings.json
 */
export function getLogConfig(): LogLevel {
  return <LogLevel>getConfiguration().get("logLevel");
}

/**
 *
 * @returns log level configs from settings.json
 */
export function getSecurityDisplayed(): boolean {
  return <boolean>getConfiguration().get("securityDisplayed");
}
