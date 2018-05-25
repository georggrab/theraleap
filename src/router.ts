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
const GameOver = () => import("@/ui/games/GameOver.vue");

import App from "@/ui/App.vue";

export const RootRouter = new VueRouter({
  routes: [
    {
      children: [
        {
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
          },
          path: "debug",
          redirect: "/debug/devicelog"
        },
        {
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
          },
          path: "recorder",
          redirect: "/recorder/main"
        },
        {
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
          },
          path: "classify",
          redirect: "/classify/classifiers"
        },
        {
          children: [
            {
              component: PreProcessing,
              path: "preprocessing"
            }
          ],
          components: {
            main: ProcessingRoot,
            tabs: ProcessingTabs
          },
          path: "data-processing",
          redirect: "/data-processing/preprocessing"
        },
        {
          children: [
            {
              component: HandMeasurement,
              path: "display"
            }
          ],
          components: {
            main: HandMeasurementRoot,
            tabs: HandMeasurementTabs
          },
          path: "measurement",
          redirect: "/measurement/display"
        },
        {
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
            },
            {
              component: GameOver,
              name: "game-over",
              path: "game-over",
              props: true
            }
          ],
          components: {
            main: GameRoot,
            tabs: GameTabs
          },
          path: "games",
          redirect: "/games/list"
        }
      ],
      component: App,
      path: "/",
      redirect: "/debug"
    }
  ]
});
