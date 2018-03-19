import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import { DeviceFacade, DeviceConnectionState, InitialDeviceState } from '@/devices';
import { RootState } from '@/state/store'
import { deviceConnector, deviceFacadeConnector } from "../plugins/deviceConnector";

export interface DeviceState {
    facade: DeviceFacade,
    connectionState: DeviceConnectionState,
    connectionHealthy: boolean | undefined
}

export const device = {
    namespaced: true,

    state: {
        facade: undefined,
        connectionState: InitialDeviceState,
        connectionHealthy: undefined
    },

    getters: {
        getDeviceFacade: (state: DeviceState) => state.facade,
        getConnectionState: (state: DeviceState) => state.connectionState,
        isConnectionHealthy: (state: DeviceState) => state.connectionHealthy
    },

    mutations: {
        setConnectionState: (state: DeviceState, connectionState: DeviceConnectionState) => {
            state.connectionState = connectionState;
        },

        setDeviceFacade: (state: DeviceState, facade: DeviceFacade) => { state.facade = facade; },
        setConnectionHealth: (state: DeviceState, health: boolean | undefined) => { 
            state.connectionHealthy = health }

    },

}

const { commit, read, dispatch } =
    getStoreAccessors<DeviceState, RootState>("device");

export const getDeviceFacade = read(device.getters.getDeviceFacade);
export const getConnectionState = read(device.getters.getConnectionState);
export const getConnectionHealthy = read(device.getters.isConnectionHealthy);

export const setConnectionState = commit(device.mutations.setConnectionState);
export const setConnectionHealth = commit(device.mutations.setConnectionHealth);
export const setDeviceFacade = commit(device.mutations.setDeviceFacade);