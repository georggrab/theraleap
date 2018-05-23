import { RootState } from "@/state/store";
import { getStoreAccessors } from "vuex-typescript";

export interface GraphicsState {
  renderer: THREE.WebGLRenderer;
}

export const graphics = {
  namespaced: true,

  state: {
    renderer: undefined
  },

  getters: {
    getRenderer: (state: GraphicsState) => state.renderer
  },

  mutations: {
    setRenderer: (state: GraphicsState, r: THREE.WebGLRenderer) => {
      state.renderer = r;
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<GraphicsState, RootState>(
  "graphics"
);

export const getRenderer = read(graphics.getters.getRenderer);
export const setRenderer = commit(graphics.mutations.setRenderer);
