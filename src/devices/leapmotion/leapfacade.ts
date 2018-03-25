import { injectable, inject } from 'inversify';
import { Observable } from '@reactivex/rxjs';

import { DeviceDriver, DeviceConnectionState, DeviceFacade, GenericHandTrackingData } from '@/devices';
import { LeapDriver } from './leapdriver';
import DIIdent from '@/dependencyinjection/symbols';

@injectable()
export class LeapFacade implements DeviceFacade {
    private handTrackingDataStream: Observable<GenericHandTrackingData> | undefined;

    constructor(
        @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER) private leapDriver: LeapDriver) {}

    public getDeviceDriver(): DeviceDriver {
        return this.leapDriver as DeviceDriver;
    }

    public getHandTrackingData(): Observable<GenericHandTrackingData> {
        if (!this.handTrackingDataStream) {
            this.handTrackingDataStream = this.leapDriver.setUpFrameStream();
        }
        return this.handTrackingDataStream;
    }

}