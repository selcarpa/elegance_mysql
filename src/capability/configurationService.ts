import * as vscode from "vscode";
import { DatabaseConfig } from "../model/configurationModel";
import { LogLevel } from "./logService";


/**
 *
 * @returns elegance.mysql from settings.json
 */
function getConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("elegance.mysql");
}

/**
 * Known issue: other extensions can get this configuration. if there is any malicious extension, it will leak database connection information from settings.json.
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
 * @returns security notice popup configuration from settings.json
 */
 export function getSecurityDisplayed(): boolean {
  return <boolean>getConfiguration().get("securityDisplayed");
}
/**
 *
 * @returns change logs popup configuration from settings.json
 */
export function getChangeLogPopUpEnable(): boolean {
  return <boolean>getConfiguration().get("changeLogPopupEnable");
}
