import * as vscode from "vscode";
export class EleganceSqlFileProvider
  implements vscode.TextDocumentContentProvider
{
  onDidChange?: vscode.Event<vscode.Uri> | undefined =
    new vscode.EventEmitter<vscode.Uri>().event;
  provideTextDocumentContent(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<string> {
    return "Elegance Sql File Provider";
  }
}
