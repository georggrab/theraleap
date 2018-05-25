import Vue from "vue";
import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { DropNFramesPreProcessorId } from "@/processing/generic/dropnframes";
import { FPSThrottlerId } from "@/processing/generic/fpsthrottler";
import { DestroyUselessFramesId } from "@/processing/leap/destroyuselessframes";
import {
  PreProcessorConfigMap,
  PreProcessorDescription
} from "@/processing/types";
import { PreProcessorConfig } from "@/processing/types";
import { RootState } from "@/state/store";

export interface PreProcessorsState {
  preprocessors: PreProcessorConfigMap;
  showIntro: boolean | undefined;
}

export const preprocessors = {
  namespaced: true,

  state: {
    preprocessors: {
      uselessFrames: {
        enabled: false,
        constructConfig: () => {
          return {
            identifier: DestroyUselessFramesId,
            args: []
          };
        }
      },
      naiveThrottler: {
        enabled: false,
        n: 0,
        constructConfig: () => {
          return {
            identifier: DropNFramesPreProcessorId,
            args: [preprocessors.state.preprocessors.naiveThrottler.n]
          };
        }
      },
      fpsThrottler: {
        enabled: false,
        frameRate: 28,
        constructConfig: () => {
          return {
            identifier: FPSThrottlerId,
            args: [preprocessors.state.preprocessors.fpsThrottler.frameRate]
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
