import { ProgressLocation, window } from "vscode";
import { execSelectAsyncProcess } from "../../capability/databaseUtils";
import { constants } from "../../capability/globalValues";
import { Logger } from "../../capability/logService";
import { resultHandlers } from "../../capability/resultHandler";
import { DatabaseConfig } from "../../model/configurationModel";
import * as util from "util";

export async function runSelectedSql(
  sql: string,
  config: DatabaseConfig,
  schemaName: string
) {
  return window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: "Preparing excute sql",
      cancellable: true,
    },
    (process, token) => {
      return new Promise<void>(async (resolve) => {
        process.report({ message: "Preparing to execute sql", increment: 0 });
        execSelectAsyncProcess(config, schemaName, sql, process, 1, 100)
          .then(([results, fields]) => {
            // get results type then goto result handler strategy
            let constructorName;
            if (results instanceof Array) {
              constructorName = Object.getPrototypeOf(results[0]).constructor
                .name;
            } else {
              constructorName = Object.getPrototypeOf(results).constructor.name;
            }
            let handler = resultHandlers.get(constructorName);
            if (handler) {
              handler({ results: results, fields: fields, sql: sql });
            } else {
              Logger.attension(
                String.raw`There's no result handler for this sql, Please submit to issue
                    url: https://github.com/AethLi/elegance_mysql/issues`
              );
            }
            resolve();
          })
          .catch((error) => {
            Logger.error(
              util.format(
                constants.errorNotify,
                config.name,
                config.host,
                sql,
                error.message
              ),
              error
            );
            resolve();
          });
      });
    }
  );
}
