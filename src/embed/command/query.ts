import { EleganceTreeItem } from "../provider/eleganceDatabaseProvider";
import * as mysql from "mysql";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { convertImports } from "../../capability/viewsUtils";

async function getQueryHtml(rootPath: string): Promise<string> {
  let promise = new Promise<string>((resolve) => {
    fs.readFile(
      path.join(rootPath, "views", "html", "query.html"),
      (err, data) => {
        if (err) {
          console.error(err);
        }
        resolve(data.toString());
      }
    );
  });

  return promise;
}

function getImports() {}

export function select500(
  item: EleganceTreeItem,
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): void {
  let connection = mysql.createConnection({
    host: item.config.host,
    user: item.config.user,
    password: item.config.password,
    database: "mysql",
  });

  let columnsSql: string =
    "SELECT COLUMN_NAME name,COLUMN_KEY FROM information_schema.columns WHERE TABLE_NAME='" +
    item.result.tableName +
    "' and TABLE_SCHEMA='" +
    item.result.schemaName +
    "' ORDER BY ORDINAL_POSITION;";

  let promise = new Promise<Array<string>>((resolve) => {
    connection.query(
      columnsSql,
      (
        error: mysql.MysqlError,
        results: Array<any>,
        fields: mysql.FieldInfo[]
      ) => {
        if (error) {
          console.error(error.message);
          throw error;
        }
        let columns: Array<string> = [];
        results.forEach((result) => {
          columns.push(result.name);
        });
        resolve(columns);
      }
    );
  });
  connection.end();

  let connection1 = mysql.createConnection({
    host: item.config.host,
    user: item.config.user,
    password: item.config.password,
    database: "mysql",
  });

  promise.then((columns) => {
    let sql: string = `select ${columns.join(",")} from \`${
      item.result.schemaName
    }\`.\`${item.result.tableName}\` limit 500`;
    console.log(sql);
    let p1 = new Promise<Array<any>>((resolve) => {
      connection1.query(
        sql,
        (
          error: mysql.MysqlError,
          results: Array<any>,
          fields: mysql.FieldInfo[]
        ) => {
          if (error) {
            console.error(error.message);
            throw error;
          }
          let sonTreeItems: EleganceTreeItem[] = [];
          results.forEach((result) => {
            console.log(result);
          });
          resolve(sonTreeItems);
        }
      );
    });
  });
  connection1.end();

  fs.readFile(
    path.join(context.extensionPath, "views", "html", "query.html"),
    (err, data) => {
      if (err) {
        console.error(err);
      }
      let htmlContent = data.toString();
      htmlContent = convertImports(
        htmlContent,
        context.extensionPath,
        (file: vscode.Uri) => {
          return panel.webview.asWebviewUri(file);
        },
        "jquery.slim.min.js",
        "colResizable-1.6.js",
        "popper.min.js",
        "bootstrap.min.js",
        "bootstrap.bundle.min.js",
        "angular.min.js",
        "query.js",
        "bootstrap.min.css",
        "query.css"
      );
      panel.webview.html = htmlContent;
    }
  );
}
