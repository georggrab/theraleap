import { Container, injectable } from 'inversify';

import { DeviceDriver, DeviceFacade, HardwareDriverConnectionSettings } from '@/devices';
import { LeapDriver, LeapFacade } from '@/devices/leapmotion';
import DIIdent from '@/dependencyinjection/symbols';
import { RootState, IStoreFactory, StoreFactory, IStoreHolder, StoreHolder } from '@/state/store';
import { Store } from 'vuex';

const AppContainer = new Container();
AppContainer.bind<DeviceDriver>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
    .to(LeapDriver).inSingletonScope();
AppContainer.bind<HardwareDriverConnectionSettings>(DIIdent.SETTINGS_HARDWARE_DRIVER_CONNECTION)
    .toConstantValue({
        host: '127.0.0.1',
        port: 6437,
        frameEventName: 'animationFrame',

        enableGestures: false
    });
AppContainer.bind<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE)
    .to(LeapFacade).inSingletonScope();
AppContainer.bind<IStoreFactory>(DIIdent.VUEX_STORE_FACTORY)
    .to(StoreFactory).inSingletonScope();
AppContainer.bind<IStoreHolder>(DIIdent.VUEX_STORE)
    .to(StoreHolder).inSingletonScope();

export { AppContainer };