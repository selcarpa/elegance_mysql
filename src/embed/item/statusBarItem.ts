import * as vscode from "vscode";

export class BarItem {
  constructor() {
    this.databaseSelectBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      1
    );
    this.databaseSelectBar.name = "elegance mysql database select";
  }
  public databaseSelectBar: vscode.StatusBarItem;
}
