import { DatabaseConfig } from "../capability/configurationService";
import { EleganceTreeItemType } from "../embed/provider/eleganceDatabaseProvider";

export class CompareToModel {
  constructor(
    public type: EleganceTreeItemType,
    public config: DatabaseConfig,
    public name: string,
    public schemaName:string
  ) {}
}
