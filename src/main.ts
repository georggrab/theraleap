import Vue from "vue";
import {
  MdCard,
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
  // @ts-ignore
} from "vue-material/dist/components";

import VueRouter from "vue-router";
import Vuex from "vuex";

[
  MdCard,
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
