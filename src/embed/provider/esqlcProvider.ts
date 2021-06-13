import * as vscode from "vscode";
class MarkdownProvider implements vscode.NotebookSerializer {
  deserializeNotebook(
    data: Uint8Array,
    token: vscode.CancellationToken
  ): vscode.NotebookData | Thenable<vscode.NotebookData> {
    let content = Buffer.from(data).toString("utf8");

    throw new Error("Method not implemented.");
  }
  serializeNotebook(
    data: vscode.NotebookData,
    token: vscode.CancellationToken
  ): Uint8Array | Thenable<Uint8Array> {
    throw new Error("Method not implemented.");
  }
}