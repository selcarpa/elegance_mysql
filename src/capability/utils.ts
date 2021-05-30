import * as vscode from "vscode";
import * as path from "path";
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
