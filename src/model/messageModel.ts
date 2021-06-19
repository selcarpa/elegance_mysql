export class Message {
  constructor(public result: any, public status: boolean) {}
}

export class QueryMessage {
  constructor(
    public columns: Array<string>,
    public rows: Array<any>,
    public sql: string,
    public options: QueryViewOptions,
    public page: Page,
    public whereClause?: string,
    public orderByClause?: string
  ) {}
}

export interface Page {
  current: number;
  total?: number;
  size: number;
}
export interface QueryViewOptions {
  showToolsBar: boolean;
  showPaginationToolsBar: boolean;
}
