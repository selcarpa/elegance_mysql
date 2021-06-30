import { FieldPacket, QueryError } from "mysql2";
import * as vscode from "vscode";
import { getDatabaseConfigs } from "../../capability/configurationService";
import { execSelect } from "../../capability/databaseUtils";
import { Values } from "../../capability/globalValues";
import { StorageService } from "../../capability/localStorageService.ts";
import { Logger } from "../../capability/logService";
import { DatabaseConfig } from "../../model/configurationModel";

export function databaseSelect() {
  let configs = getDatabaseConfigs();

  vscode.window
    .showQuickPick(
      configs.map((config) => ({
        label: config.name,
        config: config,
      })),
      { title: "select a database" }
    )
    .then(
      (
        selectedValue: { label: string; config: DatabaseConfig } | undefined
      ) => {
        if (selectedValue === undefined) {
          return;
        }

        let sql = `SELECT SCHEMA_NAME name,SCHEMA_NAME schemaName FROM information_schema.SCHEMATA;`;
        execSelect(
          selectedValue.config,
          "mysql",
          sql,
          (
            error: QueryError | null,
            results: Array<any>,
            fields: FieldPacket[]
          ) => {
            if (error) {
              Logger.error(error.message, error);
            }
            vscode.window
              .showQuickPick(
                results.map((r) => r.name),
                { title: "select a database" }
              )
              .then((schemaName) => {
                Values.selectedSchema = {
                  schemaName: schemaName,
                  config: selectedValue.config,
                };
                StorageService.setValue("selectedSchema", {
                  schemaName: schemaName,
                  config: selectedValue.config,
                });
                Values.barItem.text = `${selectedValue.config.name}-${schemaName}`;
                Values.barItem.show();
              });
          }
        );
      }
    );
}
