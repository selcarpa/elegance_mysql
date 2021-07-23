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
  * @param name A name that will be displayed into database list
  * @param host The hostname of the database you are connecting to. (Default: localhost)
  * @param port The port number to connect to. (Default: 3306)
  * @param user The MySQL user to authenticate as. (Default: root)
  * @param password The password of that MySQL user
  * @param charset The charset for the connection. This is called 'collation' in the SQL-level of MySQL (like utf8_general_ci). If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used. (Default: 'UTF8_GENERAL_CI')
  * @param localAddress The source IP address to use for TCP connection
  * @param socketPath The path to a unix domain socket to connect to. When used host and port are ignored
  * @param timezone The timezone used to store local dates. (Default: 'local')
  * @param connectTimeout The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10 seconds)
  * @param stringifyObjects Stringify objects instead of converting to values. (Default: 'true')
  * @param insecureAuth Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)
  * @param schemaFilterEnable Wheather filter schema to display of this database config, if true schema list will filter by #showSchemas. (Default: false)
  * @param showSchemas A filter list for #schemaFilterEnable
  */
  constructor(
    public name: string,
    public host: string,
    public port: number,
    public user: string,
    public password: string,
    public charset:string|undefined,
    public localAddress:string|undefined,
    public socketPath:string|undefined,
    public timezone:string|undefined,
    public connectTimeout:number|undefined,
    public stringifyObjects:boolean|undefined,
    public insecureAuth:boolean|undefined,
    public schemaFilterEnable: boolean,
    public showSchemas: Array<string>
  ) {}
}
