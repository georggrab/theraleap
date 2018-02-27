import { Container } from 'inversify';

import { DeviceDriver, DeviceFacade, HardwareDriverConnectionSettings } from '@/devices';
import { LeapDriver, LeapFacade } from '@/devices/leapmotion';
import DIIdent from '@/dependencyinjection/symbols';

const AppContainer = new Container();
AppContainer.bind<DeviceDriver>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
    .to(LeapDriver).inSingletonScope();
AppContainer.bind<HardwareDriverConnectionSettings>(DIIdent.SETTINGS_HARDWARE_DRIVER_CONNECTION)
    .toConstantValue({
        host: '127.0.0.1',
        port: 6437,
        frameEventName: 'deviceFrame',
        enableGestures: true
    });
AppContainer.bind<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE)
    .to(LeapFacade).inSingletonScope();

export { AppContainer };