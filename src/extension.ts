import * as vscode from "vscode";
import {
  EleganceDatabaseProvider as EleganceTreeNodeProvider,
  EleganceTreeItem,
} from "./embed/provider/eleganceDatabaseProvider";
import * as fs from "fs";
import * as path from "path";
import { select500 } from "./controller/query";
import { getWebviewPanel } from "./capability/utils";

export function activate(context: vscode.ExtensionContext) {
  console.log("Elegance mysql!");

  var banner: string = String.raw`
  .__                                                 
  ____  |  |    ____    ____ _____     ____    ____   ____  
_/ __ \ |  |  _/ __ \  / ___\\__  \   /    \ _/ ___\_/ __ \ 
\  ___/ |  |__\  ___/ / /_/  >/ __ \_|   |  \\  \___\  ___/ 
 \___  >|____/ \___  >\___  /(____  /|___|  / \___  >\___  >
     \/            \//_____/      \/      \/      \/     \/ 
  `;
  console.log(banner);

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
      select500(item, panel,context);
    }
  );

  vscode.commands.executeCommand(
    "setContext",
    "elegance_mysql.compareTo.supportedItem",
    ["table", "schema"]
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("html.main", () => {
      const panel = vscode.window.createWebviewPanel(
        "",
        "query",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "views", "js")),
            vscode.Uri.file(path.join(context.extensionPath, "views", "css")),
          ],
        }
      );
      fs.readFile(
        path.join(context.extensionPath, "views", "html", "query.html"),
        (err, data) => {
          if (err) {
            console.error(err);
          }
          let htmlContent = data.toString();
          let imports: Array<string> = [];
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "jquery.slim.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "colResizable-1.6.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "popper.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "bootstrap.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "bootstrap.bundle.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "js",
                    "angular.min.js"
                  )
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<script src="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(context.extensionPath, "views", "js", "query.js")
                )
              ) +
              '"></script>'
          );
          imports.push(
            '<link rel="stylesheet" href="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(
                    context.extensionPath,
                    "views",
                    "css",
                    "bootstrap.min.css"
                  )
                )
              ) +
              '">'
          );
          imports.push(
            '<link rel="stylesheet" href="' +
              panel.webview.asWebviewUri(
                vscode.Uri.file(
                  path.join(context.extensionPath, "views", "css", "query.css")
                )
              ) +
              '">'
          );

          htmlContent = htmlContent.replace(
            "<!-- [ELEGANCE_IMPORT] -->",
            imports.join("\n")
          );
          panel.webview.html = htmlContent;
        }
      );
    })
  );
}

export function deactivate() {}
