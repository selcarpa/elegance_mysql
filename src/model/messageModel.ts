export class Message {
  constructor(public result: any, public status: boolean) {}
}

export class QueryMessage {
  constructor(
    public columns: Array<string>,
    public rows: Array<any>,
    public sql: string,
    public limitValue: string | null,
    public whereClause: string | null,
    public orderByClause: string | null,
    public showToolsBar: boolean = false
  ) {}
}
