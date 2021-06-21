import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { Logger } from "./logService";

/**
 *
 */
export interface PathResolve {
  (file: vscode.Uri): vscode.Uri;
}

/**
 *
 * @param originHtml
 * @param extensionPath
 * @param pathResolve
 * @param resources
 * @returns
 */
export function convertImports(
  originHtml: string,
  extensionPath: string,
  pathResolve: PathResolve,
  ...resources: string[]
): string {
  let imports: Array<string> = [];
  for (const resource of resources) {
    if (resource.indexOf("js") !== -1) {
      let jsResource = pathResolve(
        vscode.Uri.file(path.join(extensionPath, "views", "js", resource))
      );
      imports.push(`<script src="${jsResource}"></script>`);
    } else if (resource.indexOf("css") !== -1) {
      let cssResource = pathResolve(
        vscode.Uri.file(path.join(extensionPath, "views", "css", resource))
      );
      imports.push(`<link rel="stylesheet" href="${cssResource}">`);
    }
  }

  originHtml = originHtml.replace(
    "<!-- [ELEGANCE_IMPORT] -->",
    imports.join("\n")
  );
  return originHtml;
}

/**
 *
 * @param viewType
 * @param title
 * @param showOptions
 * @param context
 * @returns
 */
export function getWebviewPanel(
  viewType: string,
  title: string,
  showOptions: vscode.ViewColumn,
  context: vscode.ExtensionContext
): vscode.WebviewPanel {
  return vscode.window.createWebviewPanel(viewType, title, showOptions, {
    retainContextWhenHidden: true,
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, "views", "js")),
      vscode.Uri.file(path.join(context.extensionPath, "views", "css")),
    ],
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
        "pagination.min.js",
        "bootstrap.min.css",
        "query.css",
        "pagination.css"
      );
      panel.webview.html = htmlContent;
    }
  );
}
