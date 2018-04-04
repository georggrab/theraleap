import Vuex, { Store } from 'vuex';
import { injectable, inject } from 'inversify';

import DIIdent from '@/dependencyinjection/symbols';

import { DeviceState, device } from '@/state/modules/device';
import { DebugState, debug } from '@/state/modules/debug';
import { RecordState, record } from '@/state/modules/record';

import { deviceConnector, deviceFacadeConnector } from './plugins/deviceConnector';
import { deviceDataTransferRate } from './plugins/deviceExtras';
import { DeviceFacade, DeviceDriver } from 'devices';

export interface RootState {
    device: DeviceState,
    debug: DebugState,
    record: RecordState
}

export interface IStoreFactory {
    create(): Store<RootState>;
}

@injectable()
export class StoreFactory implements IStoreFactory {
    constructor(
        @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE) private facade: DeviceFacade,
        @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER) private driver: DeviceDriver) { }

    create(): Store<RootState> {
        return new Vuex.Store<RootState>({
            modules: {
                device,
                debug,
                record
            },
            plugins: [
                deviceConnector(this.driver), 
                deviceFacadeConnector(this.facade), 
                deviceDataTransferRate
            ]
        });
    }
}