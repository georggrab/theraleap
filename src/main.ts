import Vue from "vue";

//@ts-ignore
import VueMaterial from "vue-material";
import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(Vuex);

import { RootRouter } from "@/router";
import { DeviceDriver } from "@/devices";
import { AppContainer } from "@/dependencyinjection";
import DIInject from "@/dependencyinjection/symbols";
import { IStoreFactory } from "state/store";

export const RootVue = new Vue({
  el: "#app",
  router: RootRouter,
  store: AppContainer.get<IStoreFactory>(DIInject.VUEX_STORE_FACTORY).get(),
  render: create => create("router-view")
});