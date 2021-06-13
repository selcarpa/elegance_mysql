import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import { openQueryHtml } from "./query";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { execSelect } from "../../capability/databaseUtils";
import { FieldPacket } from "mysql2";
import { Logger } from "../../capability/logService";
import { Message, QueryMessage } from "../../model/messageModel";

export async function details(
  item: EleganceTreeItem,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): Promise<void> {
  let limitValue = "500";

  openQueryHtml(panel, context.extensionPath);
  execSelect(
    item.config,
    "mysql",
    `select * from information_schema.columns where table_schema = '${item.result.schemaName}' and table_name = '${item.result.tableName}';`,
    (
      error: Query.QueryError | null,
      results: Array<any>,
      fields: FieldPacket[]
    ) => {
      if (error) {
        Logger.error(error.message, error);
        panel.webview.postMessage(new Message(error.message, false));
      }
      let messageContent = new QueryMessage(
        Array<string>(),
        Array<any>(),
        `select * from information_schema.columns 
        where table_schema = '${item.result.schemaName}' 
        and table_name = '${item.result.tableName}';`,
        "500",
        null,
        null,
        false
      );
      if (fields) {
        fields.forEach((field) => {
          messageContent.columns.push(field.name);
        });
      }
      Logger.debug(undefined, results);
      results.forEach((result) => {
        messageContent.rows.push(result);
      });
      panel.webview.postMessage(new Message(messageContent, true));
    }
  );
}
