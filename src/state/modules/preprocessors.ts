import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";
import {
  PreProcessorConfigMap,
  PreProcessorDescription
} from "processing/types";
import { DropNFramesPreProcessorId } from "processing/generic/dropnframes";
import { PreProcessorConfig } from "@/processing/types";
import Vue from "vue";

export interface PreProcessorsState {
  preprocessors: PreProcessorConfigMap;
  showIntro: boolean | undefined;
}

export const preprocessors = {
  namespaced: true,

  state: {
    preprocessors: {
      naiveThrottler: {
        enabled: false,
        n: 0,
        constructConfig: () => {
          return {
            identifier: DropNFramesPreProcessorId,
            args: [preprocessors.state.preprocessors.naiveThrottler.n]
          };
        }
      }
    },
    showIntro: undefined
  },

  getters: {
    getPreProcessors: (state: PreProcessorsState) => state.preprocessors,
    getShowIntro: (state: PreProcessorsState) => state.showIntro
  },

  mutations: {
    setShowIntro: (state: PreProcessorsState, show: boolean) => {
      state.showIntro = show;
    },
    modifyPreProcessor: (
      state: PreProcessorsState,
      {
        name,
        newState
      }: { name: string; newState: Partial<PreProcessorDescription> }
    ) => {
      Vue.set(state.preprocessors, name, {
        ...state.preprocessors[name],
        ...newState
      });
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<
  PreProcessorsState,
  RootState
>("preprocessors");

export const getPreProcessors = read(preprocessors.getters.getPreProcessors);
export const getShowIntro = read(preprocessors.getters.getShowIntro);

export const setShowIntro = commit(preprocessors.mutations.setShowIntro);
export const modifyPreProcessor = commit(
  preprocessors.mutations.modifyPreProcessor
);
