export class Message {
  constructor(public result: any, public status: boolean) {}
}

export class QueryMessage {
  constructor(
    public columns: Array<string>,
    public rows: Array<any>,
    public sql: string,
    public page: Page,
    public options: QueryViewOptions,
    public whereClause?: string,
    public orderByClause?: string
  ) {}
}

export class Page {
  constructor(
    public current: number,
    public total?: number,
    public size: number = 500
  ) {}
}
export interface QueryViewOptions {
  showToolsBar: boolean;
  showPaginationToolsBar: boolean;
}
