import { Memento } from "vscode";

export class StorageService {
  public static memento: Memento;

  public static getValue<T>(key: string): T | undefined {
    return this.memento.get<T>(key);
  }

  public static setValue<T>(key: string, value: T) {
    this.memento.update(key, value);
  }
}
