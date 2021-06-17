import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";
import { execSelect } from "../../capability/databaseUtils";
import { FieldPacket, QueryError } from "mysql2";
import { Logger } from "../../capability/logService";
import { Message, Page, QueryMessage } from "../../model/messageModel";
import { openQueryHtml } from "../../capability/viewsUtils";

export async function details(
  item: EleganceTreeItem,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): Promise<void> {
  openQueryHtml(panel, context.extensionPath);
  execSelect(
    item.config,
    "mysql",
    `select * from information_schema.columns where table_schema = '${item.result.schemaName}' and table_name = '${item.result.tableName}';`,
    (error: QueryError | null, results: Array<any>, fields: FieldPacket[]) => {
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
        new Page(0),
        { showToolsBar: false, showPaginationToolsBar: false }
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
