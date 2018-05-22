import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import { expect } from "chai";
import ClassifyBadge from "./ClassifyBadge.vue";

import Vuex, { Store } from "vuex";
import { RootState } from "@/state/store";
import { createStore } from "@/state/__mocks__";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ClassifyBadge", () => {
  let store: Store<RootState>;
  beforeEach(() => {
    store = createStore({} as RootState);
  });

  it("should shallow mount", () => {
    const wrapper = shallowMount(ClassifyBadge, { localVue, store });
  });
});
