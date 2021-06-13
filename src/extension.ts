import * as vscode from "vscode";
import {
  EleganceDatabaseProvider as EleganceTreeNodeProvider,
  EleganceTreeItem,
} from "./embed/provider/eleganceDatabaseProvider";
import { select500 } from "./embed/command/query";
import { getWebviewPanel } from "./capability/viewsUtils";
import { Logger } from "./capability/logService";
import {
  getLogConfig,
  getSecurityDisplayed,
} from "./capability/configurationService";
import { details } from "./embed/command/details";
import { BarItem } from "./embed/item/statusBarItem";

export function activate(context: vscode.ExtensionContext) {
  Logger.setOutputLevel(getLogConfig());
  let barItem = new BarItem();

  let securityText: string = String.raw`Security Attention:
     other extensions can get this configuration.
      if there is any malicious extension,
       it will leak database connection information from settings.json.
       Set elegance.mysql.securityDisplayed=false into settings.json to avoid this message.`;
  if (getSecurityDisplayed()) {
    vscode.window.showInformationMessage(securityText);
  }

  vscode.commands.executeCommand(
    "setContext",
    "elegance_mysql.compareTo.supportedItem",
    ["table", "schema"]
  );

  let eleganceTreeNodeProvider: EleganceTreeNodeProvider =
    new EleganceTreeNodeProvider(context.extensionPath);

  // init elegance_list view
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "elegance_list",
      eleganceTreeNodeProvider
    )
  );

  // register all commands
  /// start register

  context.subscriptions.push(
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
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("elegance_mysql.refresh", (item: any) => {
      eleganceTreeNodeProvider.refresh();
    })
  );

  //TODO: not correct way to achieve newQuery command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.newQuery",
      async (item: any) => {
        const doc = await vscode.workspace.openTextDocument({
          language: "sql",
        });
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.details",
      (item: EleganceTreeItem) => {
        let panel = getWebviewPanel(
          "elegance_mysql.query",
          "result",
          vscode.ViewColumn.One,
          context
        );
        details(item, panel, context);
      }
    )
  );
  /// end register

  //status bar item
  context.subscriptions.push(barItem.databaseSelectBar);

  //TODO: update database list and other item affect by config
  vscode.workspace.onDidChangeConfiguration((e) => {
    Logger.debug("configuration changed");
    Logger.setOutputLevel(getLogConfig());
  });

  Logger.info("Elegance mysql!");
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
