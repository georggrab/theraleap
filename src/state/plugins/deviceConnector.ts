import { AppContainer } from '@/dependencyinjection';
import DIIdent from '@/dependencyinjection/symbols';

import { DeviceDriver, DeviceFacade } from '@/devices'
import { setConnectionState, setDeviceFacade, setConnectionHealth } from '../modules/device';
import { Store } from 'vuex';
import { RootState } from '../store';

export const deviceConnector = (driver: DeviceDriver) => (store: Store<RootState>) => {
    const conn = driver.establishConnection().subscribe((state) => {
        setConnectionState(store, state);
        setConnectionHealth(store, state.connectedToNativeDeviceDriver
          && state.deviceHardwareConnected
          && state.nativeDeviceDriverOnline);
    })
}

export const deviceFacadeConnector = (facade: DeviceFacade) => (store: Store<RootState>) => {
    const facade = AppContainer.get<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
    setDeviceFacade(store, facade); 
}