import { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";

import {
  DeviceFacade,
  DeviceConnectionState,
  InitialDeviceState
} from "@/devices";
import { RootState } from "@/state/store";
import {
  deviceConnector,
  deviceFacadeConnector
} from "../plugins/deviceConnector";

export interface DeviceState {
  facade: DeviceFacade;
  connectionState: DeviceConnectionState;
  connectionHealthy: boolean | undefined;
  deviceDataTransferRate: number | undefined;
}

export interface DeviceDataTransferRate {
  currentRate: number;
  timeCounter: number;
  perSecondRate: number;
  frameAmount: number;
}

export const device = {
  namespaced: true,

  state: {
    facade: undefined,
    connectionState: InitialDeviceState,
    connectionHealthy: undefined,
    deviceDataTransferRate: undefined
  },

  getters: {
    getDeviceFacade: (state: DeviceState) => state.facade,
    getDeviceDataTransferRate: (state: DeviceState) =>
      state.deviceDataTransferRate,
    getConnectionState: (state: DeviceState) => state.connectionState,
    isConnectionHealthy: (state: DeviceState) => state.connectionHealthy
  },

  mutations: {
    setConnectionState: (
      state: DeviceState,
      connectionState: DeviceConnectionState
    ) => {
      state.connectionState = connectionState;
    },

    updateDeviceDataTransferRate: (
      state: DeviceState,
      transferRate: number
    ) => {
      state.deviceDataTransferRate = transferRate;
    },
    setDeviceFacade: (state: DeviceState, facade: DeviceFacade) => {
      state.facade = facade;
    },
    setConnectionHealth: (state: DeviceState, health: boolean | undefined) => {
      state.connectionHealthy = health;
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<DeviceState, RootState>(
  "device"
);

export const getDeviceFacade = read(device.getters.getDeviceFacade);
export const getConnectionState = read(device.getters.getConnectionState);
export const getConnectionHealthy = read(device.getters.isConnectionHealthy);
export const getDeviceDataTransferRate = read(
  device.getters.getDeviceDataTransferRate
);

export const setConnectionState = commit(device.mutations.setConnectionState);
export const setConnectionHealth = commit(device.mutations.setConnectionHealth);
export const setDeviceFacade = commit(device.mutations.setDeviceFacade);

export const updateDeviceDataTransferRate = commit(
  device.mutations.updateDeviceDataTransferRate
);
