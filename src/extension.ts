import * as vscode from "vscode";
import {
  EleganceDatabaseProvider as EleganceTreeNodeProvider,
  EleganceTreeItem,
} from "./embed/provider/eleganceDatabaseProvider";
import { select500 } from "./embed/command/query";
import { getWebviewPanel } from "./capability/viewsUtils";
import { Logger } from "./capability/logService";
import { getLogConfig } from "./capability/configurationReader";

export function activate(context: vscode.ExtensionContext) {
  Logger.setOutputLevel(getLogConfig());

  Logger.info("Elegance mysql!");

  vscode.commands.executeCommand(
    "setContext",
    "elegance_mysql.compareTo.supportedItem",
    ["table", "schema"]
  );

  vscode.window.registerTreeDataProvider(
    "elegance_list",
    new EleganceTreeNodeProvider(context.extensionPath)
  );

  vscode.commands.registerCommand(
    "elegance_mysql.select500",
    (item: EleganceTreeItem) => {
      let panel = getWebviewPanel(
        "elegance_mysql.query",
        "result",
        vscode.ViewColumn.One,
        context
      );
      select500(item, panel, context);
    }
  );
  var banner: string = String.raw`
  .__                                                 
  ____  |  |    ____    ____ _____     ____    ____   ____  
_/ __ \ |  |  _/ __ \  / ___\\__  \   /    \ _/ ___\_/ __ \ 
\  ___/ |  |__\  ___/ / /_/  >/ __ \_|   |  \\  \___\  ___/ 
 \___  >|____/ \___  >\___  /(____  /|___|  / \___  >\___  >
     \/            \//_____/      \/      \/      \/     \/ 
  `;
  Logger.plain(banner);
}

export function deactivate() {}
