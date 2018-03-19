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
import DeviceComponent from '@/ui/debug/DeviceComponent.vue';
import DeviceDebugTabs from '@/ui/debug/DeviceDebugTabs.vue';
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
                          component: StatusLog,
                          path: 'status'
                      }
                  ],
                  components: {
                    main: DeviceComponent,
                    tabs: DeviceDebugTabs
                  }  
                }
            ]
            
        }
    ]}),
    render: (create) => create('router-view'),
    store: createStore()
});