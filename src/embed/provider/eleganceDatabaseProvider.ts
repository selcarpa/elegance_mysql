import * as vscode from "vscode";
import * as path from "path";
import * as util from "util";
import { getDatabaseConfigs } from "../../capability/configurationService";
import { TreeItemCollapsibleState } from "vscode";
import { execSelect, versionCheck } from "../../capability/databaseUtils";
import { Logger } from "../../capability/logService";
import { FieldPacket, QueryError } from "mysql2";
import { constants, Values } from "../../capability/globalValues";
import { DatabaseConfig } from "../../model/configurationModel";

/**
 * children getter interface
 * @see EleganceTreeItem
 */
interface ChildrenGetter {
  (): Promise<Array<EleganceTreeItem>>;
}

/**
 * item type
 */
export enum EleganceTreeItemType {
  database,
  schema,
  tableType, //Reserved, never used
  table,
  column,
}

/**
 *
 * @param config @see DatabaseConfig
 */
function setVersion(config: DatabaseConfig): void {
  execSelect(
    config,
    "mysql",
    constants.versionSql,
    (error: QueryError | null, results: Array<any>, fields: FieldPacket[]) => {
      if (error) {
        Logger.error(error.message, error);
      }
      let version: string = results[0]["version1"];
      if (version) {
        config.version = version;
      }
    }
  );
}

function popVersionMessage(configs: Array<DatabaseConfig>) {
  let notSupportConfigs = configs.filter(
    (config) =>
      config.version &&
      !versionCheck(config.version, constants.compatibleVersionMinimize)
  );
  if (notSupportConfigs.length > 0) {
    let message = `The minimum supported version is ${
      constants.compatibleVersionMinimize
    }. This database configuration may not get full-support: ${notSupportConfigs
      .map(
        (config) =>
          `${config.name}(host:${config.host}, version:${config.version})`
      )
      .join(",")})`;
    Logger.infoAndShow(message);
  }
}

export class EleganceDatabaseProvider
  implements vscode.TreeDataProvider<EleganceTreeItem>
{
  constructor(readonly extensionPath: string) {}
  private _onDidChangeTreeData: vscode.EventEmitter<
    EleganceTreeItem | undefined | null | void
  > = new vscode.EventEmitter<EleganceTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    EleganceTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
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
        vscode.window
          .showInformationMessage(
            constants.eleganceProviderNoDatabaseNotice,
            constants.eleganceProviderNoDatabaseAction
          )
          .then((action) => {
            if (action) {
              vscode.commands.executeCommand(
                "workbench.action.openWorkspaceSettingsFile"
              );
            }
          });
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

      setTimeout(() => {
        popVersionMessage(databaseConfigs);
      }, 5);

      return databaseTreeItems;
    }
  }
}

/**
 * tree item
 */
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
    let promise = new Promise<Array<EleganceTreeItem>>((resolve) => {
      execSelect(
        this.config,
        constants.databaseMetaTableName,
        this.sql,
        (
          error: QueryError | null,
          results: Array<any>,
          fields: FieldPacket[]
        ) => {
          if (error) {
            Logger.error(
              util.format(
                constants.errorNotify,
                this.config.name,
                this.config.host,
                this.sql,
                error.message
              ),
              error
            );
            resolve([]);
          }
          let sonTreeItems: EleganceTreeItem[] = [];
          Logger.debug(undefined, results);
          results.forEach((result) => {
            //to filter out schemas with showSchemas in settings.json
            if (
              this.type === EleganceTreeItemType.database &&
              this.config.schemaFilterEnable &&
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
    return promise;
  };

  private sql!: string;

  /**
   *
   * @param label text to display
   * @param type @see EleganceTreeItemType
   * @param config @see DatabaseConfig
   * @param extensionPath extension absolute path
   * @param result result from last select
   */
  constructor(
    public readonly label: string,
    public type: EleganceTreeItemType,
    public config: DatabaseConfig,
    public extensionPath: string,
    public result: any | null = null
  ) {
    super(label, TreeItemCollapsibleState.Collapsed);
    if (result && result.comment) {
      this.tooltip = result.comment;
    }
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
        this.sql = constants.eleganceProviderSchemaSql;
        setVersion(config);
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
        this.sql = util.format(
          constants.eleganceProviderTableSql,
          result.schemaName
        );
        break;
      case EleganceTreeItemType.table:
        if (result.TABLE_TYPE === "BASE TABLE") {
          this.iconPath = {
            light: path.join(
              extensionPath,
              "media",
              "light",
              "elegance_table.svg"
            ),
            dark: path.join(
              extensionPath,
              "media",
              "dark",
              "elegance_table.svg"
            ),
          };
        } else if (
          result.TABLE_TYPE === "VIEW" ||
          result.TABLE_TYPE === "SYSTEM VIEW"
        ) {
          this.iconPath = {
            light: path.join(
              extensionPath,
              "media",
              "light",
              "elegance_view.svg"
            ),
            dark: path.join(
              extensionPath,
              "media",
              "dark",
              "elegance_view.svg"
            ),
          };
        }
        this.contextValue = "table";
        this.sql = util.format(
          constants.eleganceProviderColumnSql,
          result.tableName,
          result.schemaName
        );
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
            dark: path.join(extensionPath, "media", "dark", "elegance_key.svg"),
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
