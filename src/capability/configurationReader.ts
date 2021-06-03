import * as vscode from "vscode";
/**
 * database config model for settings.json
 */
export class DatabaseConfig {
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
 *
 * @returns database configs from settings.json
 */
export function getDatabaseConfigs(): Array<DatabaseConfig> {
  const databases = getConfiguration().get("databases");

  return <Array<DatabaseConfig>>databases;
}
