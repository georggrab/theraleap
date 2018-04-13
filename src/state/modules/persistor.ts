import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";
import { KVPersistenceProvider } from "@/state/persistence";

export interface PersistorState {
  persistor: KVPersistenceProvider<string, any> | undefined;
}

export const persist = {
  namespaced: true,

  state: {
    persistor: undefined
  },

  getters: {
    getPersistor: (state: PersistorState) => state.persistor
  }
};

const { commit, read, dispatch } = getStoreAccessors<PersistorState, RootState>(
  "persist"
);

export const getPersistor = read(persist.getters.getPersistor);
