import Vuex, { Store } from 'vuex';
import { injectable, inject } from 'inversify';

import DIIdent from '@/dependencyinjection/symbols';

import { DeviceState, device } from '@/state/modules/device';
import { DebugState, debug } from '@/state/modules/debug';
import { RecordState, record } from '@/state/modules/record';
import { GraphicsState, graphics } from '@/state/modules/graphics';

import { deviceConnector, deviceFacadeConnector } from './plugins/deviceConnector';
import { deviceDataTransferRate } from './plugins/deviceExtras';
import { DeviceFacade, DeviceDriver } from 'devices';

export interface RootState {
    device: DeviceState,
    debug: DebugState,
    record: RecordState,
    graphics: GraphicsState
}

export interface IStoreFactory {
    get(): Store<RootState>;
}

export interface IStoreHolder {
    store: Store<RootState> | undefined;
}

@injectable()
export class StoreHolder implements IStoreHolder {
    public store: Store<RootState> | undefined;
}

@injectable()
export class StoreFactory implements IStoreFactory {
    constructor(
        @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE) private facade: DeviceFacade,
        @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER) private driver: DeviceDriver,
        @inject(DIIdent.VUEX_STORE) private storeHolder: IStoreHolder) { }

    get(): Store<RootState> {
        if (!this.storeHolder.store) {
            this.storeHolder.store = new Vuex.Store<RootState>({
                modules: {
                    device,
                    debug,
                    graphics,
                    record
                },
                plugins: [
                    deviceConnector(this.driver), 
                    deviceFacadeConnector(this.facade), 
                    deviceDataTransferRate(this.facade)
                ]
            });
        }
        return this.storeHolder.store;
    }
}