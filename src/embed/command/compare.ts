import * as util from "util";
import * as vscode from "vscode";
import {
  EleganceTreeItem,
  EleganceTreeItemType,
} from "../provider/eleganceDatabaseProvider";
import { constants, Values } from "../../capability/globalValues";
import * as mysql2 from "mysql2/promise";
import { execSelectAsyncProcess as execSelectAsyncWithProcess } from "../../capability/databaseUtils";

export function compareTo(item: EleganceTreeItem) {
  Values.compareToOrigin = {
    type: item.type,
    config: item.config,
    tableName: item.result.name,
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

/**
 *
 * @param destination
 */
export async function tableCompareTo(destination: any) {
  let sql = `SHOW CREATE TABLE ${Values.compareToOrigin.tableName};`;
  let connection = await mysql2.createConnection({
    namedPlaceholders: true,
    port: Values.compareToOrigin.config.port,
    host: Values.compareToOrigin.config.host,
    user: Values.compareToOrigin.config.user,
    password: Values.compareToOrigin.config.password,
    database: Values.compareToOrigin.schemaName,
  });
  let query1 = await connection.query(sql);
  let doc1 = await vscode.workspace.openTextDocument({
    language: "sql",
    content: (<any>query1)[0][0]["Create Table"],
  });
  sql = `SHOW CREATE TABLE ${destination.tableName};`;
  connection = await mysql2.createConnection({
    namedPlaceholders: true,
    port: destination.config.port,
    host: destination.config.host,
    user: destination.config.user,
    password: destination.config.password,
    database: destination.schemaName,
  });
  let query2 = await connection.query(sql);
  let doc2 = await vscode.workspace.openTextDocument({
    language: "sql",
    content: (<any>query2)[0][0]["Create Table"],
  });
  vscode.commands.executeCommand("vscode.diff", doc1.uri, doc2.uri);
}

/**
 *
 * @param destination
 */
export async function schemaCompareTo(destination: any) {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Comparing to selected schema.",
      cancellable: false,
    },
    (process, token) => {
      return new Promise<void>(async (resolve) => {
        let sql = util.format(
          constants.showCreateSchema,
          Values.compareToOrigin.schemaName
        );
        let [results, field] = await execSelectAsyncWithProcess(
          Values.compareToOrigin.config,
          Values.compareToOrigin.schemaName,
          sql,
          process,
          0,
          10
        );
        let content1 = "";
        if (results instanceof Array) {
          content1 += (<any>results[0])["Create Database"];
        }
        content1 += "\n";

        sql = util.format(
          constants.eleganceProviderTableSql,
          Values.compareToOrigin.schemaName
        );

        // vscode.commands.executeCommand("vscode.diff", doc1.uri, doc2.uri);423ea2
        resolve();
      });
    }
  );
}
