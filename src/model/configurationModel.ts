/**
 * database config model for settings.json
 */
export class DatabaseConfig {
  /*
   * database version, this field init when toggle first layer of database list
   */
  public version?: string;

  /**
   *
   * @param name text to display on first layer of treeview
   * @param host mysql host
   * @param port mysql port
   * @param user mysql user
   * @param password mysql password
   * @param schemaFilterEnable when enable, children of database_tree_item will filter with showSchemas array
   * @param showSchemas for schemaFilterEnable
   */
  constructor(
    public name: string,
    public host: string,
    public port: number,
    public user: string,
    public password: string,
    public schemaFilterEnable: boolean,
    public showSchemas: Array<string>
  ) {}
}
