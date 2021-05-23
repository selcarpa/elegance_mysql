import { Uri } from "vscode";
import { DatabaseItem } from "./configurationReader";
import { EleganceTreeItem } from "./eleganceDatabaseProvider";

export interface ChildrenGetter {
    (): Promise<Array<EleganceTreeItem>>
    (sql: string, item: DatabaseItem, iconPath: { light: string | Uri; dark: string | Uri }): Promise<Array<EleganceTreeItem>>
}