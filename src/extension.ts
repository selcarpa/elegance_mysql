import * as vscode from "vscode";
import {
  EleganceDatabaseProvider as EleganceTreeNodeProvider,
  EleganceTreeItem,
} from "./embed/provider/eleganceDatabaseProvider";
import { select500, selectSql } from "./embed/command/query";
import { getWebviewPanel } from "./capability/viewsUtils";
import { details } from "./embed/command/details";
import {
  compareTo,
  schemaCompareTo,
  tableCompareTo,
} from "./embed/command/compare";
import { Values } from "./capability/globalValues";
import { onConfiguationChange as onConfigurationChange } from "./embed/event/configurationEvent";
import { databaseSelect } from "./embed/command/otherOperations";
import { finishStartup, initial, startupTasks } from "./embed/elegance/startup";
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
        select500(item, panel);
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
        Values.selectedSchema = {
          schemaName: item.result.schemaName,
          config: item.config,
        };
        StorageService.setValue("selectedSchema", {
          schemaName: item.result.schemaName,
          config: item.config,
        });
        Values.barItem.text = `${item.config.name}-${item.result.schemaName}`;
        Values.barItem.show();

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
        details(item, panel);
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
      async (item: EleganceTreeItem) => {
        schemaCompareTo({
          type: item.type,
          config: item.config,
          schemaName: item.result.schemaName,
        });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.compareWithSelectedTable",
      async (item: EleganceTreeItem) => {
        tableCompareTo({
          type: item.type,
          config: item.config,
          tableName: item.result.name,
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
          Values.selectedSchema.config,
          Values.selectedSchema.schemaName
        );
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("elegance_mysql.addDatabase", () => {
      vscode.commands.executeCommand(
        "workbench.action.openWorkspaceSettingsFile"
      );
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "elegance_mysql.copy",
      (item: EleganceTreeItem) => {
        vscode.env.clipboard.writeText(item.label);
      }
    )
  );
  /// end command register

  //status bar item
  Values.barItem.name = "elegance mysql database select";
  Values.barItem.command = "elegance_mysql.databaseSelect";
  context.subscriptions.push(Values.barItem);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      onConfigurationChange(e);
    })
  );
  finishStartup();
}

export function deactivate() {}
