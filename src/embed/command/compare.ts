import * as vscode from "vscode";
import { Logger } from "../../capability/logService";
import {
  EleganceTreeItem,
  EleganceTreeItemType,
} from "../provider/eleganceDatabaseProvider";
import { RuntimeValues } from "../../capability/globalValues";
import * as mysql2 from "mysql2/promise";

export function compareTo(item: EleganceTreeItem) {
  RuntimeValues.compareToOrigin = {
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

/**
 *
 * @param destination
 */
export async function tableCompareTo(destination: any) {
  let sql = `SHOW CREATE TABLE ${RuntimeValues.compareToOrigin.name};`;
  let connection = await mysql2.createConnection({
    namedPlaceholders: true,
    port: RuntimeValues.compareToOrigin.config.port,
    host: RuntimeValues.compareToOrigin.config.host,
    user: RuntimeValues.compareToOrigin.config.user,
    password: RuntimeValues.compareToOrigin.config.password,
    database: RuntimeValues.compareToOrigin.schemaName,
  });
  let query1 = await connection.query(sql);
  let doc1 = await vscode.workspace.openTextDocument({
    language: "sql",
    content: (<any>query1)[0][0]["Create Table"],
  });
  sql = `SHOW CREATE TABLE ${destination.name};`;
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
