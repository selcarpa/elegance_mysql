import * as vscode from "vscode";
import { DatabaseConfig } from "../model/configurationModel";

export class RuntimeValues {
  public static barItem: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
  public static selectedSchema: { schemaName: string; config: DatabaseConfig };
}

export const compileConstant = {
  compatibleVersion: "5.7.0",
};
