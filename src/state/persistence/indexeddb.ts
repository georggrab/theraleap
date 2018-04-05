import { injectable } from 'inversify';

import { KVPersistenceProvider } from ".";

@injectable()
export class IndexedDBPersistenceProvider<K, V> implements KVPersistenceProvider<K, V> {
    private context: string = "default"
    public getName = () => "IndexedDB"

    public setContext(ctx: string) {
        this.context = ctx;
    }

    public getTotalSize(): number {
        return 0;
    }

    public get(key: K): V | undefined {
        return undefined;
    }

    public put(key: K, val: V): boolean {
        return false;
    }

    public clear() {

    }
}