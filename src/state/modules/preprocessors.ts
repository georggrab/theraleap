import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";

export interface PreProcessorsState {}

export const preprocessors = {
  namespaced: true,

  state: {},

  getters: {},

  mutations: {}
};

const { commit, read, dispatch } = getStoreAccessors<
  PreProcessorsState,
  RootState
>("preprocessors");
