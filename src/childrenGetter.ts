import { EleganceTreeItem } from "./eleganceDatabaseProvider";

export interface ChildrenGetter {
  (): Promise<Array<EleganceTreeItem>>;
}
