import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as vscode from "vscode";

export async function details(item: EleganceTreeItem): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const uri = vscode.Uri.parse("elegance_sql_provider:details.sql");
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc, { preview: false });
    resolve();
  });
}
