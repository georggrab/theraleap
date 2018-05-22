import { getStoreAccessors } from "vuex-typescript";

import { RootState } from "@/state/store";

export interface GameState {
  games: {};
}

export interface GameDescriptions {
  [key: string]: GameSpec;
}

export interface GameSpec {}

export const games = {
  namespaced: true,

  state: {
    games: {}
  },

  getters: {
    getGames: (s: GameState) => s.games
  }
};

const { commit, read, dispatch } = getStoreAccessors<GameState, RootState>(
  "games"
);

export const getGames = read(games.getters.getGames);
