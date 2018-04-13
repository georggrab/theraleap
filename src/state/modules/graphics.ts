import * as THREE from "three";

import { RootState } from "@/state/store";
import { getStoreAccessors } from "vuex-typescript";

export interface GraphicsState {
  renderer: THREE.WebGLRenderer;
}

export const graphics = {
  namespaced: true,

  state: {
    renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true })
  },

  getters: {
    getRenderer: (state: GraphicsState) => state.renderer
  }
};

const { commit, read, dispatch } = getStoreAccessors<GraphicsState, RootState>(
  "graphics"
);

export const getRenderer = read(graphics.getters.getRenderer);
