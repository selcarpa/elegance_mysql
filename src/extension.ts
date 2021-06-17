import * as vscode from "vscode";
import {
  EleganceDatabaseProvider as EleganceTreeNodeProvider,
  EleganceTreeItem,
} from "./embed/provider/eleganceDatabaseProvider";
import { select500, selectSql } from "./embed/command/query";
import { getWebviewPanel } from "./capability/viewsUtils";
import { details } from "./embed/command/details";
import { compareTo, tableCompareTo } from "./embed/command/compare";
import { RuntimeValues } from "./capability/globalValues";
import { onConfiguationChange as onConfigurationChange } from "./embed/event/configurationEvent";
import { databaseSelect } from "./embed/command/otherOperations";
import { initial, startupTasks } from "./embed/elegance/startup";
import { StorageService } from "./capability/localStorageService.ts";

export function activate(context: vscode.ExtensionContext) {
  initial(context);
  startupTasks();

  let eleganceTreeNodeProvider: EleganceTreeNodeProvider =
    new EleganceTreeNodeProvider(context.extensionPath);

  // init elegance_list view
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "elegance_list",
      eleganceTreeNodeProvider
    )
  );

  // register all commands
  /// start register

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.select500",
      (item: EleganceTreeItem) => {
        let panel = getWebviewPanel(
          "elegance_mysql.query",
          "result",
          vscode.ViewColumn.One,
          context
        );
        select500(item, panel, context);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("elegance_mysql.refresh", (item: any) => {
      eleganceTreeNodeProvider.refresh();
    })
  );

  //TODO: not correct way to achieve newQuery command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.newQuery",
      async (item: EleganceTreeItem) => {

        RuntimeValues.selectedSchema = {
          schemaName: item.result.schemaName,
          config: item.config,
        };
        StorageService.setValue("selectedSchema", {
          schemaName: item.result.schemaName,
          config: item.config,
        });
        RuntimeValues.barItem.text = `${item.config.name}-${item.result.schemaName}`;
        RuntimeValues.barItem.show();


        let doc = await vscode.workspace.openTextDocument({
          language: "sql",
        });
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.details",
      (item: EleganceTreeItem) => {
        let panel = getWebviewPanel(
          "elegance_mysql.query",
          "result",
          vscode.ViewColumn.One,
          context
        );
        details(item, panel, context);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.compareTo",
      (item: EleganceTreeItem) => {
        compareTo(item);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.compareWithSelectedSchema",
      (item: EleganceTreeItem) => {}
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.compareWithSelectedTable",
      (item: EleganceTreeItem) => {
        tableCompareTo({
          type: item.type,
          config: item.config,
          name: item.result.name,
          schemaName: item.result.schemaName,
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("elegance_mysql.databaseSelect", () => {
      databaseSelect();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("elegance_mysql.runSelectedSql", () => {
      let editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;
        let selection = editor.selection;

        // Get the word within the selection
        let words = document.getText(selection);
        let panel = getWebviewPanel(
          "elegance_mysql.query",
          "result",
          vscode.ViewColumn.One,
          context
        );
        selectSql(
          words,
          panel,
          context,
          RuntimeValues.selectedSchema.config,
          RuntimeValues.selectedSchema.schemaName
        );
      }
    })
  );
  /// end register

  //status bar item
  RuntimeValues.barItem.name = "elegance mysql database select";
  RuntimeValues.barItem.command = "elegance_mysql.databaseSelect";
  context.subscriptions.push(RuntimeValues.barItem);

  vscode.workspace.onDidChangeConfiguration((e) => {
    onConfigurationChange(e);
  });

}

export function deactivate() {}
