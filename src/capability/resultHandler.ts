import { FieldPacket, OkPacket, ResultSetHeader } from "mysql2";
import { WebviewPanel } from "vscode";
import { Message, QueryMessage } from "../model/messageModel";
import { Logger } from "./logService";
import { openQueryHtml } from "./viewsUtils";

export const resultHandlerStrategy = new Map<string, ResultHandler>();

export function initialResultHandlerStrategy() {
  let tableResultHandler: ResultHandler = (
    result: any,
    fields: FieldPacket[],
    sql,
    panel
  ) => {
    // assmble result
    let messageContent = new QueryMessage(
      Array<string>(),
      Array<any>(),
      sql,
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
    fields.forEach((field) => {
      messageContent.columns.push(field.name);
    });
    openQueryHtml(panel);
    panel.webview.postMessage(new Message(messageContent, true));
  };

  resultHandlerStrategy.set("ResultSetHeader", (result: ResultSetHeader) => {
    Logger.attension(JSON.stringify(result).trim());
  });
  resultHandlerStrategy.set("OkPacket", tableResultHandler);
}

interface ResultHandler {
  (result: any, fields: any, sql: string, panel: WebviewPanel): void;
}
