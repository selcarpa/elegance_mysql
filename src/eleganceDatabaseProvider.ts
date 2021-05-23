import * as vscode from 'vscode';
import * as path from 'path';
import { DatabaseItem, getDatabaseItems } from './configurationReader';
import { TreeItemCollapsibleState, Uri } from 'vscode';
import * as mysql from 'mysql';
import { ChildrenGetter } from './childrenGetter';
import { FieldInfo } from 'mysql';

export class EleganceDatabaseProvider implements vscode.TreeDataProvider<EleganceTreeItem>{
    constructor() { }
    onDidChangeTreeData?: vscode.Event<void | EleganceTreeItem | null | undefined> | undefined;
    getTreeItem(element: EleganceTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: EleganceTreeItem): vscode.ProviderResult<EleganceTreeItem[]> {
        if (element) {
            return element.getChildren();
        } else {//shows database list in root element
            let databaseItems = getDatabaseItems();
            databaseItems = databaseItems.filter(d => d.alwaysEnable);
            if (databaseItems.length < 1) {
                vscode.window.showInformationMessage('No database in this eleganceMysql');
            }
            let databaseTreeItems: EleganceTreeItem[] = [];
            databaseItems.forEach(
                item => {
                    let e: EleganceTreeItem = new EleganceTreeItem(item.name, TreeItemCollapsibleState.Collapsed);
                    e.iconPath = {
                        light: path.join(__filename, '..', '..', 'media', 'light', 'elegance_database.svg'),
                        dark: path.join(__filename, '..', '..', 'media', 'dark', 'elegance_database.svg')
                    };
                    e.getChildren = function () {
                        let connection = mysql.createConnection({
                            host: item.host,
                            user: item.user,
                            password: item.password,
                            database: 'mysql'
                        });

                        connection.connect();

                        let sql = "SELECT * FROM information_schema.SCHEMATA;";
                        let promise = new Promise<Array<EleganceTreeItem>>(resolve => {
                            connection.query(sql, function (error: any, results: Array<any>, fields: FieldInfo[]) {
                                if (error) {
                                    throw error;
                                }
                                let sonTreeItems: EleganceTreeItem[] = [];
                                results.forEach(
                                    result => {
                                        let e: EleganceTreeItem = new EleganceTreeItem(result.SCHEMA_NAME, TreeItemCollapsibleState.Collapsed);
                                        e.iconPath = {
                                            light: path.join(__filename, '..', '..', 'media', 'light', 'elegance_table.svg'),
                                            dark: path.join(__filename, '..', '..', 'media', 'dark', 'elegance_table.svg')
                                        };
                                        e.getChildren = function () {
                                            let connection = mysql.createConnection({
                                                host: item.host,
                                                user: item.user,
                                                password: item.password,
                                                database: 'mysql'
                                            });

                                            connection.connect();

                                            let sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA =" + result.SCHEMA_NAME + ";";

                                            let promise = new Promise<Array<EleganceTreeItem>>(resolve => {
                                                connection.query(sql, function (error: any, results: Array<any>, fields: FieldInfo[]) {
                                                    if (error) {
                                                        throw error;
                                                    }
                                                    let sonTreeItems: EleganceTreeItem[] = [];
                                                    results.forEach(
                                                        result => {
                                                            let e: EleganceTreeItem = new EleganceTreeItem(result.SCHEMA_NAME, TreeItemCollapsibleState.Collapsed);
                                                            e.iconPath = {
                                                                light: path.join(__filename, '..', '..', 'media', 'light', 'elegance_table.svg'),
                                                                dark: path.join(__filename, '..', '..', 'media', 'dark', 'elegance_table.svg')
                                                            };

                                                            sonTreeItems.push(e);
                                                        }
                                                    );
                                                    resolve(sonTreeItems);
                                                });
                                            });
                                            connection.end();
                                            return promise;
                                        };
                                        sonTreeItems.push(e);
                                    }
                                );
                                resolve(sonTreeItems);
                            });
                        });
                        connection.end();
                        return promise;
                    };
                    databaseTreeItems.push(e);
                }
            );
            return databaseTreeItems;

        }
    }
}

//todo improve it
// function databaseItemGetChildren():Array<EleganceTreeItem>{

// }

export class EleganceTreeItem extends vscode.TreeItem {
    public getChildren!: ChildrenGetter;
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}

enum EleganceTreeItemType {
    database, schema, table, column
}
