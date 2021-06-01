import { EleganceTreeItem } from "../embed/provider/eleganceDatabaseProvider";

export interface ChildrenGetter {
  (): Promise<Array<EleganceTreeItem>>;
}
