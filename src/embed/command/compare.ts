import { FieldPacket } from "mysql2";
import Query = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
import { execSelect } from "../../capability/databaseUtils";
import { Logger } from "../../capability/logService";
import { CompareToModel } from "../../model/compareModel";

export class CompareToValue {
  static origin: CompareToModel;
}

export function tableCompareTo(destination: CompareToModel) {
  let sql = `SHOW CREATE TABLE ${CompareToValue.origin.name};`;
  execSelect(
    CompareToValue.origin.config,
    CompareToValue.origin.schemaName,
    sql,
    (
      error: Query.QueryError | null,
      results: Array<any>,
      fields: FieldPacket[]
    ) => {
      if (error) {
        Logger.error(error.message, error);
      }
      Logger.debug(undefined, results);
    }
  );
}
