import { Observable, Subscriber } from '@reactivex/rxjs';
import { DeviceFacade, DeviceDriver, GenericHandTrackingData } from '@/devices/generic'
import { injectable } from 'inversify';

//import { RootStore } from '@/state/store';
//import { getActiveRecording } from '@/state/modules/record';

@injectable()
export abstract class AbstractDeviceFacade implements DeviceFacade {
    abstract getDeviceDriver(): DeviceDriver;
    abstract getDeviceTrackingData(): Observable<GenericHandTrackingData> | undefined;

    public getHandTrackingData(): Observable<GenericHandTrackingData> | undefined {
        //const recordedData = getActiveRecording(RootStore);
        //if (recordedData) {
        //    return Observable.create(async (subscriber: Subscriber<GenericHandTrackingData>) => {
        //        recordedData.recording.forEach(async (recFrame, i, arr) => {
        //            subscriber.next(recFrame.data);
        //            if (i <= arr.length - 2) {
        //                await new Promise((resolve) => 
        //                    window.setTimeout(resolve, arr[i + 1].time - recFrame.time));
        //            }
        //        })
        //    });
        //} else {
        //    return this.getDeviceTrackingData();
        //}
        return undefined;
    }
}