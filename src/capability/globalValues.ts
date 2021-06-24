import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { EleganceTreeItemType } from "../embed/provider/eleganceDatabaseProvider";
import { DatabaseConfig } from "../model/configurationModel";

export class RuntimeValues {
  public static barItem: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
  public static selectedSchema: { schemaName: string; config: DatabaseConfig };
  public static compareToOrigin: {
    type: EleganceTreeItemType;
    config: DatabaseConfig;
    name: string;
    schemaName: string;
  };
  public static context: ExtensionContext;
}

export const compileConstant = {
  compatibleVersionMinimize: "5.7.0",
  updateNotice: "Elegance mysql has been updated!",
  updateNoticeAction: "change logs",
  changeLogUrl:
    "https://github.com/AethLi/elegance_mysql/blob/main/CHANGELOG.md",
  queryDefaultSize: 500,
  databaseMetaTableName: "mysql",
  eleganceProviderSchemaSql:
    "SELECT SCHEMA_NAME name,SCHEMA_NAME schemaName FROM information_schema.SCHEMATA;",
  eleganceProviderTableSql: `SELECT TABLE_NAME name,TABLE_NAME tableName,TABLE_SCHEMA schemaName,TABLE_COMMENT comment,TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA ='%s';`,
  eleganceProviderColumnSql: `SELECT COLUMN_NAME name,COLUMN_KEY,COLUMN_COMMENT comment FROM information_schema.columns WHERE TABLE_NAME='%s' and TABLE_SCHEMA='%s' ORDER BY ORDINAL_POSITION;`,
  eleganceProviderNoDatabaseNotice: "No database in settings.json",
  eleganceProviderNoDatabaseAction: "Open Workspace Settings(JSON)",
  versionSql: "SELECT VERSION() as version1",
};
