import Vuex from 'vuex';

import { DeviceState, device } from '@/state/modules/device';
import { DebugState, debug } from '@/state/modules/debug';
import { RecordState, record } from '@/state/modules/record';

import { deviceConnector, deviceFacadeConnector } from './plugins/deviceConnector';
import { deviceDataTransferRate } from './plugins/deviceExtras';

export interface RootState {
    device: DeviceState,
    debug: DebugState,
    record: RecordState
}

export const createStore = () => new Vuex.Store<RootState>({
    modules: {
        device,
        debug,
        record
    },
    plugins: [deviceConnector, deviceFacadeConnector, deviceDataTransferRate]
})