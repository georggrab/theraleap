import { Observable, Subscriber, Subject, Subscription, ReplaySubject } from '@reactivex/rxjs';
import { injectable, inject } from 'inversify';

import { DeviceFacade, DeviceDriver, GenericHandTrackingData } from '@/devices/generic'
import DIIdent from '@/dependencyinjection/symbols';
import { IStoreFactory, IStoreHolder, RootState } from 'state/store';

import { getActiveRecording, HandTrackRecording } from '@/state/modules/record';
import { Store } from 'vuex';
import { multicast } from '@reactivex/rxjs/dist/package/operator/multicast';

async function replayInfinite(subscriber: Subscriber<GenericHandTrackingData>, recordedData: HandTrackRecording) {
    for (let i = 0; i < recordedData.recording.length; i++) {
        subscriber.next(recordedData.recording[i].data);
        if (i <= recordedData.recording.length - 2) {
            await new Promise((resolve) => 
                window.setTimeout(resolve, 
                    recordedData.recording[i + 1].time - recordedData.recording[i].time));
        } else {
            i = 0;
        }
    }
}

function createFakeDeviceStream(recordedData: HandTrackRecording): Observable<GenericHandTrackingData> {
    return Observable.create(async (subscriber: Subscriber<GenericHandTrackingData>) => {
        await replayInfinite(subscriber, recordedData);
    });
}

@injectable()
export abstract class AbstractDeviceFacade implements DeviceFacade {
    private internalStream: ReplaySubject<GenericHandTrackingData> = new ReplaySubject(0);
    private fakeSubscription: Subscription | undefined;
    private realSubscription: Subscription | undefined;

    abstract getDeviceDriver(): DeviceDriver;
    abstract getDeviceTrackingData(): Observable<GenericHandTrackingData> | undefined;

    public getHandTrackingData(store: Store<RootState>): Observable<GenericHandTrackingData> | undefined {
        const recordedData = getActiveRecording(store);
        if (this.realSubscription) {
            this.realSubscription.unsubscribe();
            this.realSubscription = undefined;
        }
            if (this.fakeSubscription) {
                this.fakeSubscription.unsubscribe();
                this.fakeSubscription = undefined;
            }
        if (recordedData) {
            if (!this.fakeSubscription) {
                this.fakeSubscription = createFakeDeviceStream(recordedData)
                    .subscribe(this.internalStream);
            }
        } else {
            const trackingData = this.getDeviceTrackingData();
            if (trackingData && !this.realSubscription) {
                this.realSubscription = trackingData
                    .subscribe(this.internalStream);
            }
        }
        return this.internalStream;
    }
}