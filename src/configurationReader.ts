import * as vscode from 'vscode';
export class DatabaseConfig {
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

export function getDatabaseConfigs(): Array<DatabaseConfig> {
    const databases = getConfiguration().get("databases");

    return <Array<DatabaseConfig>>databases;
}