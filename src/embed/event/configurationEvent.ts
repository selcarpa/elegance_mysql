import { ConfigurationChangeEvent } from "vscode";
import { getLogConfig } from "../../capability/configurationService";
import { Logger } from "../../capability/logService";

export function onConfiguationChange(e: ConfigurationChangeEvent) {
  if (e.affectsConfiguration("elegance.mysql.logLevel")) {
    Logger.setOutputLevel(getLogConfig());
  }
}
