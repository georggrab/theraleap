import { AppContainer } from '@/dependencyinjection';
import DIIdent from '@/dependencyinjection/symbols';

import { DeviceDriver, DeviceFacade } from '@/devices'
import { setConnectionState, setDeviceFacade, setConnectionHealth, updateDeviceDataTransferRate, DeviceDataTransferRate } from '../modules/device';

//@ts-ignore
import { sizeof } from 'sizeof'

export const deviceDataTransferRate = (store: any) => {
    const facade = AppContainer.get<DeviceFacade>(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_FACADE);
    const data = facade.getHandTrackingData();

    const transferRate = {
        currentRate: 0, timeCounter: 0, perSecondRate: 0, timestamp: Date.now(), frameAmount: 0 };

    if (data) {
        data.subscribe((frame) => {
            transferRate.timeCounter += 
                (Date.now() - transferRate.timestamp);
            transferRate.timestamp = Date.now();
            transferRate.currentRate += sizeof(frame.data);
            transferRate.frameAmount++;
            if (transferRate.timeCounter >= 1000) {
                transferRate.timeCounter = 0;
                transferRate.perSecondRate = 
                    transferRate.currentRate / transferRate.frameAmount;
                transferRate.frameAmount = 0;
                transferRate.currentRate = 0;
                updateDeviceDataTransferRate(store, transferRate.perSecondRate);
            }
        });
    } else {
        console.warn('Cannot compute Transfer Rate: Facade does not contain Hand Tracking data.');
    }
}