import { AppContainer } from '@/dependencyinjection';
import DIIdent from '@/dependencyinjection/symbols';

import { DeviceDriver, DeviceFacade } from '@/devices'
import { setConnectionState, setDeviceFacade, setConnectionHealth } from '../modules/device';

export const deviceConnector = (store: any) => {
    const driver = AppContainer.get<DeviceDriver>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER);
    const conn = driver.establishConnection().subscribe((state) => {
        setConnectionState(store, state);
        setConnectionHealth(store, state.connectedToNativeDeviceDriver
          && state.deviceHardwareConnected
          && state.nativeDeviceDriverOnline);
    })
}

export const deviceFacadeConnector = (store: any) => {
    const facade = AppContainer.get<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
    setDeviceFacade(store, facade); 
}