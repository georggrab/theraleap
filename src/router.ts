import VueRouter from "vue-router";

import DeviceLog from "@/ui/debug/DeviceLog.vue";
import StatusLog from "@/ui/debug/StatusLog.vue";
import DeviceGraphicalLog from "@/ui/debug/DeviceGraphicalLog.vue";
import DeviceDebugRoot from "@/ui/debug/DeviceDebugRoot.vue";
import DeviceDebugTabs from "@/ui/debug/DeviceDebugTabs.vue";

import DeviceRecorderRoot from "@/ui/recorder/DeviceRecorderRoot.vue";
import DeviceRecorderTabs from "@/ui/recorder/DeviceRecorderTabs.vue";
import DeviceRecorder from "@/ui/recorder/DeviceRecorder.vue";
import DeviceRecorderSettings from "@/ui/recorder/DeviceRecorderSettings.vue";

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
        }
      ]
    }
  ]
});
