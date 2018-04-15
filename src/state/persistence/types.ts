export interface KVPersistenceProvider<K, V extends Object> {
  getTotalSize(): number | undefined;
  getName(): string;
  get(key: K): Promise<V>;
  getAll(): Promise<V[]>;
  count(): Promise<number>;
  put(key: K, val: V): Promise<void>;
  update(key: K, val: Partial<V>): Promise<void>;
  delete(key: K): Promise<void>;
  clear(): Promise<number>;
}
