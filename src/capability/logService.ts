import { window } from "vscode";

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE";

export class Logger {
  private static outputChannel = window.createOutputChannel("elegance_mysql");

  private static logLevel: LogLevel = "INFO";

  public static setOutputLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  /**
   * Logs a message with debug log level.
   *
   * @param message The message to append to the output channel
   * @param data Any data that serializable
   */
  public static debug(message?: string, data?: unknown): void {
    if (
      this.logLevel === "NONE" ||
      this.logLevel === "INFO" ||
      this.logLevel === "WARN" ||
      this.logLevel === "ERROR"
    ) {
      return;
    }
    if (message) {
      this.logMessage(message, "DEBUG");
    }
    if (data) {
      this.logObject(data, "DEBUG");
    }
  }

  /**
   * Logs a message with info log level.
   *
   * @param message The message to append to the output channel
   * @param data Any data that serializable
   */
  public static info(message: string, data?: unknown): void {
    if (
      this.logLevel === "NONE" ||
      this.logLevel === "WARN" ||
      this.logLevel === "ERROR"
    ) {
      return;
    }
    this.logMessage(message, "INFO");
    if (data) {
      this.logObject(data, "INFO");
    }
  }

  /**
   * Logs a message with info level and showInformationMessage
   *
   * @param message
   * @param data Any data that serializable
   */
  public static infoAndShow(message: string, data?: unknown): void {
    this.info(message, data);
    window.showInformationMessage(message);
  }

  /**
   * Logs a message with warning log level.
   *
   * @param message The message to append to the output channel
   * @param data Any data that serializable
   */
  public static warning(message: string, data?: unknown): void {
    if (this.logLevel === "NONE" || this.logLevel === "ERROR") {
      return;
    }
    this.logMessage(message, "WARN");
    if (data) {
      this.logObject(data, "WARN");
    }
  }

  /**
   * Logs a message with error log level.
   *
   * @param message The message to append to the output channel
   * @param error Typescript Error
   */
  public static error(message: string, error?: Error | string): void {
    window.showErrorMessage(message);
    if (this.logLevel === "NONE") {
      return;
    }
    this.logMessage(message, "ERROR");
    if (typeof error === "string") {
      // Errors as a string usually only happen with
      // plugins that don't return the expected error.
      this.outputChannel.appendLine(error);
    } else if (error?.message || error?.stack) {
      if (error?.message) {
        this.logMessage(error.message, "ERROR");
      }
      if (error?.stack) {
        this.outputChannel.appendLine(error.stack);
      }
    } else if (error) {
      this.logObject(error, "ERROR");
    }
  }

  /**
   * Reveal outputChannel in the UI
   */
  public static show() {
    this.outputChannel.show();
  }

  /**
   * Serialize with json and log it
   *
   * @param data Any data that serializable
   * @param logLevel
   */
  private static logObject(data: unknown, logLevel: LogLevel): void {
    const message = JSON.stringify(data).trim();
    this.logMessage(message, logLevel);
  }

  /**
   * Append message to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
   * @param logLevel
   */
  private static logMessage(message: string, logLevel: LogLevel): void {
    const title = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`["${logLevel}" - ${title}] ${message}`);
  }

  /**
   * Append message with no format
   *
   * @param message
   */
  public static plain(message: string): void {
    this.outputChannel.appendLine(message);
  }

  /**
   * Append message to the output channel and popup
   *
   * @param message message to display
   */
  public static attension(message: string): void {
    this.info(message);
    this.show();
  }
}
