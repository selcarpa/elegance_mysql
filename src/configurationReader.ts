import * as vscode from 'vscode';
export class DatabaseConfig {
    constructor(
        public name: string,
        public host: string,
        public port: number,
        public user: string,
        public password: string,
        public schemaFilterEnable: boolean,
        public showSchemas: Array<string>) {
    }
}



function getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("elegance.mysql");
}

export function getDatabaseConfigs(): Array<DatabaseConfig> {
    const databases = getConfiguration().get("databases");

    return <Array<DatabaseConfig>>databases;
}