import * as vscode from "vscode";
import * as path from "path";

export interface PathResolve {
  (file: vscode.Uri): vscode.Uri;
}

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

export function getWebviewPanel(
  viewType: string,
  title: string,
  showOptions: vscode.ViewColumn,
  context: vscode.ExtensionContext
): vscode.WebviewPanel {
  return vscode.window.createWebviewPanel(viewType, title, showOptions, {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, "views", "js")),
      vscode.Uri.file(path.join(context.extensionPath, "views", "css")),
    ],
  });
}
