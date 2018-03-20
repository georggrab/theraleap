import Vuex from 'vuex';

import { DeviceFacade, DeviceConnectionState, InitialDeviceState } from '@/devices';
import { DeviceState, device } from '@/state/modules/device';
import { DebugState, debug } from '@/state/modules/debug';
import { deviceConnector, deviceFacadeConnector } from './plugins/deviceConnector';
import { deviceDataTransferRate } from './plugins/deviceExtras';

export interface RootState {
    device: DeviceState,
    debug: DebugState
}

export const createStore = () => new Vuex.Store<RootState>({
    modules: {
        device,
        debug
    },
    plugins: [deviceConnector, deviceFacadeConnector, deviceDataTransferRate]
})