import * as vscode from "vscode";
import * as path from "path";
import { DatabaseConfig, getDatabaseConfigs } from "../../capability/configurationReader";
import { TreeItemCollapsibleState } from "vscode";
import * as mysql from "mysql";
import { ChildrenGetter } from "../../capability/childrenGetter";
import { FieldInfo, MysqlError } from "mysql";

export class EleganceDatabaseProvider
  implements vscode.TreeDataProvider<EleganceTreeItem>
{
  constructor(readonly extensionPath: string) {}
  onDidChangeTreeData?:
    | vscode.Event<void | EleganceTreeItem | null | undefined>
    | undefined;
  getTreeItem(
    element: EleganceTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: EleganceTreeItem
  ): vscode.ProviderResult<EleganceTreeItem[]> {
    if (element) {
      return element.getChildren();
    } else {
      //shows database list in root element
      let databaseConfigs = getDatabaseConfigs();
      if (databaseConfigs.length < 1) {
        vscode.window.showInformationMessage(
          "No database in this eleganceMysql"
        );
      }
      let databaseTreeItems: EleganceTreeItem[] = [];
      databaseConfigs.forEach((config) => {
        let e: EleganceTreeItem = new EleganceTreeItem(
          config.name,
          EleganceTreeItemType.database,
          config,
          this.extensionPath
        );
        databaseTreeItems.push(e);
      });
      return databaseTreeItems;
    }
  }
}

export class EleganceTreeItem extends vscode.TreeItem {
  public getChildren: ChildrenGetter = () => {
    let sonItemType: EleganceTreeItemType;
    switch (this.type) {
      case EleganceTreeItemType.database:
        sonItemType = EleganceTreeItemType.schema;
        break;
      case EleganceTreeItemType.schema:
        sonItemType = EleganceTreeItemType.table;
        break;
      case EleganceTreeItemType.table:
        sonItemType = EleganceTreeItemType.column;
        break;
      case EleganceTreeItemType.column:
        break;
      default:
    }

    let connection = mysql.createConnection({
      host: this.config.host,
      user: this.config.user,
      password: this.config.password,
      database: "mysql",
    });

    connection.connect();

    let promise = new Promise<Array<EleganceTreeItem>>((resolve) => {
      connection.query(
        this.sql,
        (error: MysqlError, results: Array<any>, fields: FieldInfo[]) => {
          if (error) {
            console.error(error.message);
            throw error;
          }
          let sonTreeItems: EleganceTreeItem[] = [];
          results.forEach((result) => {
            console.log(result);

            //to filter out schemas with showSchemas in settings.json
            if (
              this.config.schemaFilterEnable &&
              this.type === EleganceTreeItemType.database &&
              this.config.showSchemas.indexOf(result.name) <= -1
            ) {
            } else {
              let e: EleganceTreeItem = new EleganceTreeItem(
                result.name,
                sonItemType,
                this.config,
                this.extensionPath,
                result
              );
              sonTreeItems.push(e);
            }
          });
          resolve(sonTreeItems);
        }
      );
    });
    connection.end();
    return promise;
  };

  private sql!: string;

  constructor(
    public readonly label: string,
    public type: EleganceTreeItemType,
    public config: DatabaseConfig,
    public extensionPath: string,
    public result: any | null = null
  ) {
    super(label, TreeItemCollapsibleState.Collapsed);
    switch (type) {
      case EleganceTreeItemType.database:
        this.iconPath = {
          light: path.join(
            extensionPath,
            "media",
            "light",
            "elegance_database.svg"
          ),
          dark: path.join(
            extensionPath,
            "media",
            "dark",
            "elegance_database.svg"
          ),
        };
        this.contextValue = "database";
        this.sql =
          "SELECT SCHEMA_NAME name,SCHEMA_NAME schemaName FROM information_schema.SCHEMATA;";
        break;
      case EleganceTreeItemType.schema:
        this.iconPath = {
          light: path.join(
            extensionPath,
            "media",
            "light",
            "elegance_schema.svg"
          ),
          dark: path.join(
            extensionPath,
            "media",
            "dark",
            "elegance_schema.svg"
          ),
        };
        this.contextValue = "schema";
        this.sql =
          "SELECT TABLE_NAME name,TABLE_NAME tableName,TABLE_SCHEMA schemaName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA ='" +
          result.schemaName +
          "';";
        break;
      case EleganceTreeItemType.table:
        this.iconPath = {
          light: path.join(
            extensionPath,
            "media",
            "light",
            "elegance_table.svg"
          ),
          dark: path.join(extensionPath, "media", "dark", "elegance_table.svg"),
        };
        this.contextValue = "table";
        this.sql =
          "SELECT COLUMN_NAME name,COLUMN_KEY FROM information_schema.columns WHERE TABLE_NAME='" +
          result.tableName +
          "' and TABLE_SCHEMA='" +
          result.schemaName +
          "' ORDER BY ORDINAL_POSITION;";
        break;
      case EleganceTreeItemType.column:
        if (result.COLUMN_KEY === "PRI") {
          this.iconPath = {
            light: path.join(
              extensionPath,
              "media",
              "light",
              "elegance_key.svg"
            ),
            dark: path.join(
              extensionPath,
              "media",
              "dark",
              "elegance_key.svg"
            ),
          };
        } else {
          this.iconPath = {
            light: path.join(
              extensionPath,
              "media",
              "light",
              "elegance_column.svg"
            ),
            dark: path.join(
              extensionPath,
              "media",
              "dark",
              "elegance_column.svg"
            ),
          };
        }
        this.contextValue = "column";
        this.collapsibleState = TreeItemCollapsibleState.None;
        break;
      default:
    }
  }
}

enum EleganceTreeItemType {
  database,
  schema,
  table,
  column,
}
