import VueRouter from "vue-router";

const DeviceLog = () =>
  import(/* webpackChunkName: "group-debug" */ "@/ui/debug/DeviceLog.vue");
const StatusLog = () =>
  import(/* webpackChunkName: "group-debug" */ "@/ui/debug/StatusLog.vue");
const DeviceGraphicalLog = () =>
  import(/* webpackChunkName: "group-debug" */ "@/ui/debug/DeviceGraphicalLog.vue");
const DeviceDebugRoot = () =>
  import(/* webpackChunkName: "group-debug" */ "@/ui/debug/DeviceDebugRoot.vue");
const DeviceDebugTabs = () =>
  import(/* webpackChunkName: "group-debug" */ "@/ui/debug/DeviceDebugTabs.vue");

const DeviceRecorderRoot = () =>
  import(/* webpackChunkName: "group-recorder" */ "@/ui/recorder/DeviceRecorderRoot.vue");
const DeviceRecorderTabs = () =>
  import(/* webpackChunkName: "group-recorder" */ "@/ui/recorder/DeviceRecorderTabs.vue");
const DeviceRecorder = () =>
  import(/* webpackChunkName: "group-recorder" */ "@/ui/recorder/DeviceRecorder.vue");
const DeviceRecorderSettings = () =>
  import(/* webpackChunkName: "group-recorder" */ "@/ui/recorder/DeviceRecorderSettings.vue");

const Classifiers = () =>
  import(/* webpackChunkName: "group-classifiers" */ "@/ui/classify/Classifiers.vue");
const ClassifyRoot = () =>
  import(/* webpackChunkName: "group-classifiers" */ "@/ui/classify/ClassifyRoot.vue");
const ClassifySettings = () =>
  import(/* webpackChunkName: "group-classifiers" */ "@/ui/classify/ClassifySettings.vue");
const ClassifyTabs = () =>
  import(/* webpackChunkName: "group-classifiers" */ "@/ui/classify/ClassifyTabs.vue");

import App from "@/ui/App.vue";

export const RootRouter = new VueRouter({
  routes: [
    {
      path: "/",
      component: App,
      redirect: "/debug",
      children: [
        {
          path: "debug",
          redirect: "/debug/devicelog",
          children: [
            {
              component: DeviceLog,
              path: "devicelog"
            },
            {
              component: DeviceGraphicalLog,
              path: "hand"
            },
            {
              component: StatusLog,
              path: "status"
            }
          ],
          components: {
            main: DeviceDebugRoot,
            tabs: DeviceDebugTabs
          }
        },
        {
          path: "recorder",
          redirect: "/recorder/main",
          children: [
            {
              component: DeviceRecorder,
              path: "main"
            },
            {
              component: DeviceRecorderSettings,
              path: "settings"
            }
          ],
          components: {
            main: DeviceRecorderRoot,
            tabs: DeviceRecorderTabs
          }
        },
        {
          path: "classify",
          redirect: "/classify/classifiers",
          children: [
            {
              component: Classifiers,
              path: "classifiers"
            },
            {
              component: ClassifySettings,
              path: "settings"
            }
          ],
          components: {
            main: ClassifyRoot,
            tabs: ClassifyTabs
          }
        }
      ]
    }
  ]
});
