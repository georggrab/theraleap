import VueRouter from "vue-router";

const DeviceLog = () => import("@/ui/debug/DeviceLog.vue");
const StatusLog = () => import("@/ui/debug/StatusLog.vue");
const DeviceGraphicalLog = () => import("@/ui/debug/DeviceGraphicalLog.vue");
const DeviceDebugRoot = () => import("@/ui/debug/DeviceDebugRoot.vue");
const DeviceDebugTabs = () => import("@/ui/debug/DeviceDebugTabs.vue");

const DeviceRecorderRoot = () => import("@/ui/recorder/DeviceRecorderRoot.vue");
const DeviceRecorderTabs = () => import("@/ui/recorder/DeviceRecorderTabs.vue");
const DeviceRecorder = () => import("@/ui/recorder/DeviceRecorder.vue");
const DeviceRecorderSettings = () =>
  import("@/ui/recorder/DeviceRecorderSettings.vue");

const Classifiers = () => import("@/ui/classify/Classifiers.vue");
const ClassifyRoot = () => import("@/ui/classify/ClassifyRoot.vue");
const ClassifySettings = () => import("@/ui/classify/ClassifySettings.vue");
const ClassifyTabs = () => import("@/ui/classify/ClassifyTabs.vue");

const PreProcessing = () => import("@/ui/data-processing/PreProcessing.vue");
const ProcessingRoot = () => import("@/ui/data-processing/ProcessingRoot.vue");
const ProcessingTabs = () => import("@/ui/data-processing/ProcessingTabs.vue");

const HandMeasurement = () => import("@/ui/measure/HandMeasurement.vue");
const HandMeasurementRoot = () =>
  import("@/ui/measure/HandMeasurementRoot.vue");
const HandMeasurementTabs = () =>
  import("@/ui/measure/HandMeasurementTabs.vue");

const Games = () => import("@/ui/games/GameList.vue");
const GameSettings = () => import("@/ui/games/GameSettings.vue");
const GameRoot = () => import("@/ui/games/GameRoot.vue");
const GameTabs = () => import("@/ui/games/GameTabs.vue");
const GameExecutor = () => import("@/ui/games/GameExecutor.vue");

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
        },
        {
          path: "data-processing",
          redirect: "/data-processing/preprocessing",
          children: [
            {
              component: PreProcessing,
              path: "preprocessing"
            }
          ],
          components: {
            main: ProcessingRoot,
            tabs: ProcessingTabs
          }
        },
        {
          path: "measurement",
          redirect: "/measurement/display",
          children: [
            {
              component: HandMeasurement,
              path: "display"
            }
          ],
          components: {
            main: HandMeasurementRoot,
            tabs: HandMeasurementTabs
          }
        },
        {
          path: "games",
          redirect: "/games/list",
          children: [
            {
              component: Games,
              path: "list"
            },
            {
              component: GameSettings,
              path: "settings"
            },
            {
              component: GameExecutor,
              path: "play/:gameIdentifier",
              props: true
            }
          ],
          components: {
            main: GameRoot,
            tabs: GameTabs
          }
        }
      ]
    }
  ]
});
