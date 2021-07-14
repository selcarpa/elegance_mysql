import { FieldPacket } from "mysql2";
import { ViewColumn } from "vscode";
import { Message, QueryMessage } from "../model/messageModel";
import { Logger } from "./logService";
import { getWebviewPanel, openQueryHtml } from "./viewsUtils";

interface ResultHandler {
  (result: ResultStruct): void;
}

interface ResultStruct {
  results: any;
  fields?: FieldPacket[];
  sql: string;
}

export const resultHandlerStrategy = new Map<string, ResultHandler>();

export function initialResultHandlerStrategy() {
  let tableResultHandler: ResultHandler = (result: ResultStruct) => {
    let panel = getWebviewPanel(
      "elegance_mysql.query",
      result.sql,
      ViewColumn.One
    );
    // assmble result
    let messageContent = new QueryMessage(
      Array<string>(),
      Array<any>(),
      result.sql,
      {
        showPaginationToolsBar: false,
        showToolsBar: false,
      },
      {
        current: 0,
        size: 0,
        total: 0,
      },
      undefined,
      undefined
    );
    if (result.fields) {
      result.fields.forEach((field) => {
        messageContent.columns.push(field.name);
      });
    }
    result.results.forEach((r: any) => {
      Logger.debug(JSON.stringify(r).trim());
      messageContent.rows.push(r);
    });
    openQueryHtml(panel);
    panel.webview.postMessage(new Message(messageContent, true));
  };

  resultHandlerStrategy.set("ResultSetHeader", (result: ResultStruct) => {
    Logger.attension(JSON.stringify(result.results).trim());
  });
  resultHandlerStrategy.set("TextRow", tableResultHandler);
  resultHandlerStrategy.set("RowDataPacket", tableResultHandler);
}

export const errorHandler = function (e: Error) {
  Logger.error(e.message, e);
};
