import { window } from "vscode";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE";

export class Logger {
  private static outputChannel = window.createOutputChannel("elegance_mysql");

  private static logLevel: LogLevel = "INFO";

  public static setOutputLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  /**
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
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
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
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
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
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

  public static error(message: string, error?: Error | string) {
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

  public static show() {
    this.outputChannel.show();
  }

  private static logObject(data: unknown, logLevel: LogLevel): void {
    const message = JSON.stringify(data).trim();
    this.logMessage(message, logLevel);
  }

  /**
   * Append messages to the output channel and format it with a title
   *
   * @param message The message to append to the output channel
   */
  private static logMessage(message: string, logLevel: LogLevel): void {
    const title = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`["${logLevel}" - ${title}] ${message}`);
  }

  /**
   *
   * @param message
   */
  public static plain(message: string): void {
    this.outputChannel.appendLine(message);
  }
}
