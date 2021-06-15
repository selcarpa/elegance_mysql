import * as vscode from "vscode";
import { DatabaseConfig } from "./configurationService";

class RuntimeConstant {
  public static instance?: RuntimeConstant;
  public barItem?: vscode.StatusBarItem;
  public selectedSchema?: { schemaName: string; config: DatabaseConfig };
}

export function getRuntimeConstant(): RuntimeConstant {
  if (!RuntimeConstant.instance) {
    RuntimeConstant.instance = new RuntimeConstant();
  }
  return RuntimeConstant.instance;
}
