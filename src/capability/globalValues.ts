import * as vscode from "vscode";
import { DatabaseConfig } from "../model/configurationModel";

export class RuntimeValues {
  public static barItem: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
  public static selectedSchema: { schemaName: string; config: DatabaseConfig };
}

export const compileConstant = {
  compatibleVersion: "5.7.0",
  updateNotice: "Elegance mysql has been updated!",
  updateNoticeAction: "what's news",
  changeLogUrl:
    "https://github.com/AethLi/elegance_mysql/blob/main/CHANGELOG.md",
  queryDefaultSize: 500,
  eleganceProviderSchemaSql:
    "SELECT SCHEMA_NAME name,SCHEMA_NAME schemaName FROM information_schema.SCHEMATA;",
  versionSql: "SELECT VERSION() as version1",
};
