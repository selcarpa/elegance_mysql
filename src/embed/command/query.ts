import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { convertImports } from "../../capability/viewsUtils";
import { execSelect } from "../../capability/databaseUtils";
import { Message, QueryMessage } from "../../model/messageModel";
import { Logger } from "../../capability/logService";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { FieldPacket } from "mysql2";
import { DatabaseConfig } from "../../capability/configurationService";

function getQueryResult(
  query: {
    sql: string;
    limitValue: string | null;
    whereClause: string | null;
    orderByClause: string | null;
  },
  config: DatabaseConfig,
  schemaName: string
): Promise<any> {
  return new Promise((resolve) => {
    execSelect(
      config,
      schemaName,
      `${query.sql}  ${query.whereClause ? "where " + query.whereClause : ""} ${
        query.orderByClause ? "order by " + query.orderByClause : ""
      } ${query.limitValue ? "limit " + query.limitValue : "limit 500"}`,
      (
        error: Query.QueryError | null,
        results: Array<any>,
        fields: FieldPacket[]
      ) => {
        if (error) {
          Logger.error(error.message, error);
          resolve(new Message(error.message,false));
        }
        let messageContent = new QueryMessage(
          Array<string>(),
          Array<any>(),
          query.sql,
          query.limitValue,
          query.whereClause,
          query.orderByClause
        );
        if (fields) {
          fields.forEach((field) => {
            messageContent.columns.push(field.name);
          });
        }
        results.forEach((result) => {
          messageContent.rows.push(result);
        });
        resolve(new Message(messageContent,true));
      }
    );
  });
}

/**
 * just open a query webview
 * @param panel
 * @param extensionPath
 */
export function openQueryHtml(
  panel: vscode.WebviewPanel,
  extensionPath: string
) {
  fs.readFile(
    path.join(extensionPath, "views", "html", "query.html"),
    (err, data) => {
      if (err) {
        Logger.error(err.message, err);
      }
      let htmlContent = data.toString();
      htmlContent = convertImports(
        htmlContent,
        extensionPath,
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
}

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
  let columnsSql: string = `SELECT COLUMN_NAME name,COLUMN_KEY FROM information_schema.columns WHERE TABLE_NAME='${item.result.tableName}' and TABLE_SCHEMA='${item.result.schemaName}' ORDER BY ORDINAL_POSITION;`;
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
        columns.push(`\`${result.name}\``);
      });

      let limitValue = "500";
      let sql: string = `select ${columns.join(",")} from ${
        item.result.tableName
      }`;

      openQueryHtml(panel, context.extensionPath);
      getQueryResult(
        {
          sql: sql,
          limitValue: limitValue,
          whereClause: null,
          orderByClause: null,
        },
        item.config,
        item.result.schemaName
      ).then((m) => panel.webview.postMessage(m));
    }
  );
  panel.webview.onDidReceiveMessage(
    (message) => {
      if (!message.limitValue) {
        message.limitValue = 500;
      }
      getQueryResult(
        {
          sql: message.sql,
          limitValue: message.limitValue,
          whereClause: message.whereClause,
          orderByClause: message.orderByClause,
        },
        item.config,
        item.result.schemaName
      ).then((m) => panel.webview.postMessage(m));
    },
    undefined,
    context.subscriptions
  );
}
