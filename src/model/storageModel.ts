import { DatabaseConfig } from "./configurationModel";

export interface SelectedSchema {
  config: DatabaseConfig;
  schemaName: string;
}
