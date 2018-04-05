import { Store } from "vuex";

import { KVPersistenceProvider } from "@/state/persistence";
import { RootState } from '@/state/store';

export const initializePersistence = (persistor: KVPersistenceProvider<string, any>) => (store: Store<RootState>) => {
    store.state.persist.persistor = persistor;
}