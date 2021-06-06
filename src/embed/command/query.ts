import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { convertImports } from "../../capability/viewsUtils";
import { execSelect } from "../../capability/connectionUtils";
import { Message } from "../../model/messageModel";
import { Logger } from "../../capability/logService";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { FieldPacket } from "mysql2";

/**
 *
 * @param item
 * @param panel
 * @param context
 */
export function select500(
  item: EleganceTreeItem,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): void {
  let columnsSql: string =
    "SELECT COLUMN_NAME name,COLUMN_KEY FROM information_schema.columns WHERE TABLE_NAME='" +
    item.result.tableName +
    "' and TABLE_SCHEMA='" +
    item.result.schemaName +
    "' ORDER BY ORDINAL_POSITION;";

  execSelect(
    item.config,
    "mysql",
    columnsSql,
    (
      error: Query.QueryError | null,
      results: Array<any>,
      fields: FieldPacket[]
    ) => {
      if (error) {
        console.error(error.message);
        throw error;
      }
      let columns: Array<string> = [];
      results.forEach((result) => {
        columns.push(result.name);
      });

      let sql: string = `select ${columns.join(",")} from ${
        item.result.tableName
      } limit 500`;
      Logger.debug(sql);
      execSelect(
        item.config,
        item.result.schemaName,
        sql,
        (
          error: Query.QueryError | null,
          results: Array<any>,
          fields: FieldPacket[]
        ) => {
          if (error) {
            console.error(error.message);
            throw error;
          }
          let sonTreeItems: EleganceTreeItem[] = [];
          let messageContent = {
            columns: Array<string>(),
            rows: Array<any>(),
          };
          if (fields) {
            fields.forEach((field) => {
              messageContent.columns.push(field.name);
            });
          }
          results.forEach((result) => {
            messageContent.rows.push(result);
          });
          fs.readFile(
            path.join(context.extensionPath, "views", "html", "query.html"),
            (err, data) => {
              if (err) {
                console.error(err);
              }
              let htmlContent = data.toString();
              htmlContent = convertImports(
                htmlContent,
                context.extensionPath,
                (file: vscode.Uri) => {
                  return panel.webview.asWebviewUri(file);
                },
                "jquery.slim.min.js",
                "colResizable-1.6.js",
                "popper.min.js",
                "bootstrap.min.js",
                "bootstrap.bundle.min.js",
                "angular.min.js",
                "query.js",
                "bootstrap.min.css",
                "query.css"
              );
              panel.webview.html = htmlContent;
            }
          );
          panel.webview.postMessage(new Message(messageContent, true));
        }
      );
    }
  );
}
