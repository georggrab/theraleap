import Vue from "vue";
import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";

export interface ClassifierState {
  classifiers: { [name: string]: any };
}

export const classifier = {
  namespaced: true,

  state: {
    classifiers: {
      ThumbSpreadClassifier: {
        enabled: false,
        threshhold: 3
      }
    }
  },

  getters: {
    getClassifiers: (state: ClassifierState) => state.classifiers
  },

  mutations: {
    modifyClassifier: (
      state: ClassifierState,
      { name, newState }: { name: string; newState: any }
    ) => {
      Vue.set(state.classifiers, name, {
        ...state.classifiers[name],
        ...newState
      });
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<
  ClassifierState,
  RootState
>("classifier");

export const getClassifiers = read(classifier.getters.getClassifiers);
export const modifyClassifier = commit(classifier.mutations.modifyClassifier);
