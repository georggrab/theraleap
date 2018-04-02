import Vue from 'vue';
import 'es6-promise/auto';

//@ts-ignore
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(Vuex)

import DeviceLog from '@/ui/debug/DeviceLog.vue';
import StatusLog from '@/ui/debug/StatusLog.vue';
import DeviceDebugRoot from '@/ui/debug/DeviceDebugRoot.vue';
import DeviceDebugTabs from '@/ui/debug/DeviceDebugTabs.vue';

import DeviceRecorderRoot from '@/ui/recorder/DeviceRecorderRoot.vue';
import DeviceRecorderTabs from '@/ui/recorder/DeviceRecorderTabs.vue';
import DeviceRecorder from '@/ui/recorder/DeviceRecorder.vue';
import DeviceRecorderSettings from '@/ui/recorder/DeviceRecorderSettings.vue';

import GraphicalHandLogger from '@/ui/debug/GraphicalHandLogger.vue';
import App from '@/ui/App.vue';

import { DeviceDriver } from '@/devices';
import { createStore } from '@/state/store';


new Vue({
    el: '#app',
    router: new VueRouter({ routes: [
        {
            path: '/',
            component: App,
            redirect: '/debug',
            children: [
                { path: 'debug', 
                  redirect: '/debug/devicelog',
                  children: [
                      {
                          component: DeviceLog,
                          path: 'devicelog'
                      },
                      {
                          component: GraphicalHandLogger,
                          path: 'hand'
                      },
                      {
                          component: StatusLog,
                          path: 'status'
                      }
                  ],
                  components: {
                    main: DeviceDebugRoot,
                    tabs: DeviceDebugTabs
                  }  
                },
                {
                    path: 'recorder',
                    redirect: '/recorder/main',
                    children: [
                        {
                            component: DeviceRecorder,
                            path: 'main'
                        },
                        {
                            component: DeviceRecorderSettings,
                            path: 'settings'
                        }
                    ],
                    components: {
                        main: DeviceRecorderRoot,
                        tabs: DeviceRecorderTabs
                    }
                }
            ]
        }
    ]}),
    render: (create) => create('router-view'),
    store: createStore()
});