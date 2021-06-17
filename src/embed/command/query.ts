import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import { execSelect } from "../../capability/databaseUtils";
import {
  Message,
  Page,
  QueryMessage,
  QueryViewOptions,
} from "../../model/messageModel";
import { Logger } from "../../capability/logService";
import { FieldPacket, QueryError } from "mysql2";
import { DatabaseConfig } from "../../model/configurationModel";
import { openQueryHtml } from "../../capability/viewsUtils";

function getCountResult(
  sql: string,
  config: DatabaseConfig,
  schemaName: string
): Promise<Page> {
  return new Promise((r) => {
    execSelect(config, schemaName, `SELECT COUNT(1) FROM(${sql})`);
  });
}

/**
 * Assmble sql with where, orderby, limit clause, execute and assble result
 * @param queryParamas query information
 * @param config database config
 * @param schemaName schema name of this query used
 * @returns
 */
function getQueryResult(
  queryParamas: {
    sql: string;
    page?: Page;
    whereClause?: string;
    orderByClause?: string;
  },
  config: DatabaseConfig,
  schemaName: string,
  options: QueryViewOptions
): Promise<any> {
  return new Promise((resolve) => {
    let limitClause;
    if (queryParamas.page) {
      limitClause = ` limit ${
        queryParamas.page.current * queryParamas.page.size
      },${queryParamas.page.size}`;
    }

    execSelect(
      config,
      schemaName,
      `${queryParamas.sql}${
        queryParamas.whereClause ? " where " + queryParamas.whereClause : ""
      }${
        queryParamas.orderByClause
          ? " order by " + queryParamas.orderByClause
          : ""
      }${limitClause || ""}`, //sql in fact
      (
        error: QueryError | null,
        results: Array<any>,
        fields: FieldPacket[]
      ) => {
        if (error) {
          Logger.error(error.message, error);
          resolve(new Message(error.message, false));
        }
        // assmble result
        let messageContent = new QueryMessage(
          Array<string>(),
          Array<any>(),
          queryParamas.sql,
          new Page(
            queryParamas.page ? queryParamas.page.current : 0,
            0,
            queryParamas.page ? queryParamas.page.size : 0
          ),
          options,
          queryParamas.whereClause,
          queryParamas.orderByClause
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
    (error: QueryError | null, results: Array<any>, fields: FieldPacket[]) => {
      if (error) {
        console.error(error.message);
        throw error;
      }
      let columns: Array<string> = [];
      results.forEach((result) => {
        columns.push(`\`${result.name}\``);
      });

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
        {
          showToolsBar: true,
          showPaginationToolsBar: true,
        }
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
        {
          showToolsBar: true,
          showPaginationToolsBar: true,
        }
      ).then((m) => panel.webview.postMessage(m));
    },
    undefined,
    context.subscriptions
  );
}

//TODO: Distinguish limit clause or not give a default pagination
export function selectSql(
  sql: string,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  config: DatabaseConfig,
  schemaName: string
) {
  sql = `SELECT * FROM (${sql}) cfd30866091d4a0d9cf12cf76fc448ee`;

  openQueryHtml(panel, context.extensionPath);
  getQueryResult(
    {
      sql: sql,
      page: new Page(0),
    },
    config,
    schemaName,
    {
      showToolsBar: false,
      showPaginationToolsBar: true,
    }
  ).then((m) => panel.webview.postMessage(m));
}
