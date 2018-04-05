export interface KVPersistenceProvider<K,V> {
    getTotalSize(): number | undefined;
    getName(): string;
    get(key: K): V | undefined;
    getAll(): V[] | undefined;
    put(key: K, val: V): boolean;
    delete(key: K): boolean;
    clear(): void;
}