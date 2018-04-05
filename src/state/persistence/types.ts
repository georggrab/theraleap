export interface KVPersistenceProvider<K,V> {
    setContext(context: string): void;
    getTotalSize(): number | undefined;
    getName(): string;
    get(key: K): V | undefined;
    put(key: K, val: V): boolean;
    clear(): void;
}