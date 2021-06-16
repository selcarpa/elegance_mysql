import * as vscode from "vscode";
import { FieldPacket, QueryError } from "mysql2";
import { execSelect } from "../../capability/databaseUtils";
import { Logger } from "../../capability/logService";
import {
  EleganceTreeItem,
  EleganceTreeItemType,
} from "../provider/eleganceDatabaseProvider";
import { DatabaseConfig } from "../../model/configurationModel";

export function compareTo(item: EleganceTreeItem) {
  CompareToValue.origin = {
    type: item.type,
    config: item.config,
    name: item.result.name,
    schemaName: item.result.schemaName,
  };
  vscode.commands.executeCommand(
    "setContext",
    "elegance_mysql.compare_schema_selected",
    false
  );
  vscode.commands.executeCommand(
    "setContext",
    "elegance_mysql.compare_table_selected",
    false
  );
  switch (item.type) {
    case EleganceTreeItemType.schema:
      vscode.commands.executeCommand(
        "setContext",
        "elegance_mysql.compare_schema_selected",
        true
      );
      break;
    case EleganceTreeItemType.table:
      vscode.commands.executeCommand(
        "setContext",
        "elegance_mysql.compare_table_selected",
        true
      );
      break;
  }
}

export class CompareToValue {
  static origin: {
    type: EleganceTreeItemType;
    config: DatabaseConfig;
    name: string;
    schemaName: string;
  };
}

export function tableCompareTo(destination: any) {
  let sql = `SHOW CREATE TABLE ${CompareToValue.origin.name};`;
  execSelect(
    CompareToValue.origin.config,
    CompareToValue.origin.schemaName,
    sql,
    (error: QueryError | null, results: Array<any>, fields: FieldPacket[]) => {
      if (error) {
        Logger.error(error.message, error);
      }
      Logger.debug(undefined, results);
    }
  );
}
