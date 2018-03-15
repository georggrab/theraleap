import Vue from 'vue';
import 'es6-promise/auto';

//@ts-ignore
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'

Vue.use(VueMaterial)
Vue.use(VueRouter)

import LeapDebugInterface from '@/ui/LeapDebugInterface.vue';
import DIIdent from '@/dependencyinjection/symbols';
import { AppContainer } from '@/dependencyinjection';
import { DeviceDriver } from '@/devices';


const driver = AppContainer.get<DeviceDriver>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER);
const conn = driver.establishConnection().subscribe((state) => {
    console.log('State of Connection:', state);
})

new Vue({
    el: '#app',
    render: (render) => render(LeapDebugInterface),
});