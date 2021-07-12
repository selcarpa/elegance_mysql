import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import { execSelect, execSelectAsync } from "../../capability/databaseUtils";
import {
  Message,
  Page,
  QueryMessage,
  QueryViewOptions,
} from "../../model/messageModel";
import { Logger } from "../../capability/logService";
import { FieldPacket, QueryError, ResultSetHeader } from "mysql2";
import { DatabaseConfig } from "../../model/configurationModel";
import { getWebviewPanel, openQueryHtml } from "../../capability/viewsUtils";
import { constants, Values } from "../../capability/globalValues";
import { resultHandlerStrategy } from "../../capability/resultHandler";

function getCountResult(
  sql: string,
  config: DatabaseConfig,
  schemaName: string
): Promise<number> {
  return new Promise((r) => {
    execSelect(
      config,
      schemaName,
      `SELECT COUNT(1) as elegance_c1 FROM(${sql}) as elegance_t1`,
      (err, result, fields) => {
        if (err) {
          Logger.error(err.message, err);
          r(0);
        } else {
          Logger.debug(undefined, result);
          r(result[0].elegance_c1);
        }
      }
    );
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
          options,
          {
            current: queryParamas.page ? queryParamas.page.current : 0,
            total: queryParamas.page ? queryParamas.page.total : 0,
            size: queryParamas.page ? queryParamas.page.size : 0,
          },
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
 * @param item EleganceTreeItem
 * @param panel webview panel instance
 * @param context vscode extension context
 */
export function select500(
  item: EleganceTreeItem,
  panel: vscode.WebviewPanel
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

      openQueryHtml(panel);
      getCountResult(sql, item.config, item.result.schemaName).then((c1) => {
        getQueryResult(
          {
            sql: sql,
            page: {
              current: 0,
              total: c1,
              size: constants.queryDefaultSize,
            },
          },
          item.config,
          item.result.schemaName,
          {
            showToolsBar: true,
            showPaginationToolsBar: true,
          }
        ).then((m) => panel.webview.postMessage(m));
      });
    }
  );
  panel.webview.onDidReceiveMessage(
    (message) => {
      // avoid unlimitted select
      if (!message.limitValue) {
        message.limitValue = 500;
      }
      getCountResult(message.sql, item.config, item.result.schemaName).then(
        (c1) => {
          getQueryResult(
            {
              sql: message.sql,
              page: {
                current: message.page.current,
                total: c1,
                size: message.page.size,
              },
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
        }
      );
    },
    undefined,
    Values.context.subscriptions
  );
}

//TODO: Distinguish limit clause or not give a default pagination
export async function selectSql(
  sql: string,
  config: DatabaseConfig,
  schemaName: string
) {
  let [results, fields] = await execSelectAsync(config, schemaName, sql);
  if (results instanceof Array) {
    let handler = resultHandlerStrategy.get(
      Object.getPrototypeOf(results[0]).constructor.name
    );
    if (handler) {
      handler({ results: results, fields: fields, sql: sql });
    }
  } else {
    let handler = resultHandlerStrategy.get(
      Object.getPrototypeOf(results).constructor.name
    );
    if (handler) {
      handler({ results: results, fields: fields, sql: sql });
    }
  }
}
