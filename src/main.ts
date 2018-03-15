import Vue from 'vue';
import 'es6-promise/auto';

//@ts-ignore
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(Vuex)

import LeapDebugInterface from '@/ui/debug/LeapDebugInterface.vue';
import LeapDebugTabs from '@/ui/debug/LeapDebugTabs.vue';
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
                  components: {
                    main: LeapDebugInterface,
                    tabs: LeapDebugTabs
                } }
            ]
        }
    ]}),
    render: (create) => create('router-view'),
    store: createStore()
});