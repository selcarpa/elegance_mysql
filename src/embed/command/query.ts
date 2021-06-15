import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { convertImports } from "../../capability/viewsUtils";
import { execSelect } from "../../capability/databaseUtils";
import { Message, Page, QueryMessage } from "../../model/messageModel";
import { Logger } from "../../capability/logService";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { FieldPacket } from "mysql2";
import {
  DatabaseConfig,
  getDatabaseConfigs,
} from "../../capability/configurationService";
import { RuntimeValues } from "../../capability/globalValues";

/**
 *
 * @param query query information
 * @param config database config
 * @param schemaName schema name of this query used
 * @returns
 */
function getQueryResult(
  query: {
    sql: string;
    page: Page;
    whereClause?: string;
    orderByClause?: string;
  },
  config: DatabaseConfig,
  schemaName: string,
  showToolsBar: boolean
): Promise<any> {
  return new Promise((resolve) => {
    execSelect(
      config,
      schemaName,
      `${query.sql}${query.whereClause ? " where " + query.whereClause : ""}${
        query.orderByClause ? " order by " + query.orderByClause : ""
      }${query.page.size ? " limit " + query.page.size : " limit 500"}`,
      (
        error: Query.QueryError | null,
        results: Array<any>,
        fields: FieldPacket[]
      ) => {
        if (error) {
          Logger.error(error.message, error);
          resolve(new Message(error.message, false));
        }
        let messageContent = new QueryMessage(
          Array<string>(),
          Array<any>(),
          query.sql,
          new Page(0, 0, query.page.size),
          showToolsBar,
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
        resolve(new Message(messageContent, true));
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
          page: new Page(0),
        },
        item.config,
        item.result.schemaName,
        true
      ).then((m) => panel.webview.postMessage(m));
    }
  );
  panel.webview.onDidReceiveMessage(
    (message) => {
      // avoid unlimitted select
      if (!message.limitValue) {
        message.limitValue = 500;
      }
      getQueryResult(
        {
          sql: message.sql,
          page: new Page(0),
          whereClause: message.whereClause,
          orderByClause: message.orderByClause,
        },
        item.config,
        item.result.schemaName,
        true
      ).then((m) => panel.webview.postMessage(m));
    },
    undefined,
    context.subscriptions
  );
}

export function selectSql(
  sql: string,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  config: DatabaseConfig,
  schemaName: string
) {
  sql = `SELECT * FROM (${sql}) cfd30866091d4a0d9cf12cf76fc448ee`;
  let limitValue = "500";

  openQueryHtml(panel, context.extensionPath);
  getQueryResult(
    {
      sql: sql,
      page: new Page(0),
    },
    config,
    schemaName,
    false
  ).then((m) => panel.webview.postMessage(m));
}

/**
 * TODO: persist it
 */
export function databaseSelect() {
  let configs = getDatabaseConfigs();

  vscode.window
    .showQuickPick(
      configs.map((config) => ({
        label: config.name,
        config: config,
      })),
      { title: "select a database" }
    )
    .then(
      (
        selectedValue: { label: string; config: DatabaseConfig } | undefined
      ) => {
        if (selectedValue === undefined) {
          return;
        }

        let sql = `SELECT SCHEMA_NAME name,SCHEMA_NAME schemaName FROM information_schema.SCHEMATA;`;
        execSelect(
          selectedValue.config,
          "mysql",
          sql,
          (
            error: Query.QueryError | null,
            results: Array<any>,
            fields: FieldPacket[]
          ) => {
            if (error) {
              Logger.error(error.message, error);
            }
            vscode.window
              .showQuickPick(
                results.map((r) => r.name),
                { title: "select a database" }
              )
              .then((schemaName) => {
                RuntimeValues.selectedSchema = {
                  schemaName: schemaName,
                  config: selectedValue.config,
                };
                RuntimeValues.barItem.text = `${selectedValue.config.name}-${schemaName}`;
                RuntimeValues.barItem.show();
              });
          }
        );
      }
    );
}
