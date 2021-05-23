import * as vscode from 'vscode';
export class DatabaseItem {
    public enable: boolean;
    constructor(
        public name: string,
        public host: string,
        public port: number,
        public user: string,
        public password: string,
        public alwaysEnable: boolean,
        public schemaFilterEnable: boolean,
        public inSchemas: Array<string>) {
        this.enable = alwaysEnable;
    }
}



function getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("EleganceMysql");
}

export function getDatabaseItems(): Array<DatabaseItem> {
    const databases = getConfiguration().get("databases");

    return <Array<DatabaseItem>>databases;
}