import { injectable } from "inversify";
import idb from "idb";

import { KVPersistenceProvider } from "@/state/persistence";

@injectable()
export class IndexedDBPersistenceProvider<K, V extends Object>
  implements KVPersistenceProvider<K, V> {
  private context: string = "default";
  public getName = () => "IndexedDB";

  public setContext(ctx: string) {
    this.context = ctx;
  }

  public getTotalSize(): number | undefined {
    return undefined;
  }

  public async get(key: K): Promise<V> {
    const store = await this.getObjectStore("readonly");
    return await store.get(key);
  }

  public async getAll(): Promise<V[]> {
    const store = await this.getObjectStore("readonly");
    return await store.getAll();
  }

  public async count(): Promise<number> {
    const store = await this.getObjectStore("readonly");
    return await store.count();
  }

  public async put(key: K, val: V): Promise<void> {
    const store = await this.getObjectStore("readwrite");
    await store.put(val, key.toString());
    return;
  }

  public async update(key: K, val: Partial<V>): Promise<void> {
    const value = await this.get(key);
    await this.put(key, { ...(value as any), ...(val as any) });
  }

  public async delete(key: K): Promise<void> {
    const store = await this.getObjectStore("readwrite");
    return await store.delete(key.toString());
  }

  public async clear(): Promise<number> {
    const store = await this.getObjectStore("readwrite");
    const countBefore = await store.count();
    await store.clear();
    const countAfter = await store.count();
    return countBefore - countAfter;
  }

  private async getDb() {
    return idb.open(IndexedDBPersistenceProvider.name, 1, upgrade => {
      switch (upgrade.oldVersion) {
        case 0:
        /* fall through */
        case 1:
          upgrade.createObjectStore(this.context);
        /* fall through */
      }
    });
  }

  private async getObjectStore(mode: "readonly" | "readwrite" | undefined) {
    const db = await this.getDb();
    const tx = db.transaction(this.context, mode);
    return tx.objectStore(this.context);
  }

  private onSuccess() {}
}
