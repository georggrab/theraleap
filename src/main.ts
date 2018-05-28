import Vue from "vue";
import {
  MdApp,
  MdButton,
  MdCard,
  MdCheckbox,
  MdContent,
  MdDivider,
  MdDrawer,
  MdEmptyState,
  MdField,
  MdIcon,
  MdList,
  MdProgress,
  MdSnackbar,
  MdSubheader,
  MdSwitch,
  MdTabs,
  MdToolbar,
  MdTooltip
  // @ts-ignore
} from "vue-material/dist/components";

import VueRouter from "vue-router";
import Vuex from "vuex";

[
  MdCard,
  MdCheckbox,
  MdApp,
  MdSwitch,
  MdSubheader,
  MdField,
  MdDivider,
  MdIcon,
  MdProgress,
  MdTooltip,
  MdTabs,
  MdContent,
  MdButton,
  MdList,
  MdDrawer,
  MdToolbar,
  MdEmptyState,
  MdSnackbar
].forEach(x => Vue.use(x));
Vue.use(VueRouter);
Vue.use(Vuex);

// @ts-ignore
import VueOffline from "vue-offline";
Vue.use(VueOffline);

import { AppContainer } from "@/dependencyinjection";
import DIInject from "@/dependencyinjection/symbols";
import { DeviceDriver } from "@/devices";
import { RootRouter } from "@/router";
import { IStoreFactory } from "state/store";

declare const __path__: string;
declare const __prod__: boolean;

if ("serviceWorker" in navigator && __prod__) {
  navigator.serviceWorker.register(__path__ + "service-worker.js");
}

export const RootVue = new Vue({
  el: "#app",
  render: create => create("router-view"),
  router: RootRouter,
  store: AppContainer.get<IStoreFactory>(DIInject.VUEX_STORE_FACTORY).get()
});
