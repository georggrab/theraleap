import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";

export interface ClassifierState {}

export const classifier = {
  namespaced: true,

  state: {},

  getters: {},

  mutations: {}
};

const { commit, read, dispatch } = getStoreAccessors<
  ClassifierState,
  RootState
>("classifier");
