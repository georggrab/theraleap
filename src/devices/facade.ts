import {
  Observable,
  Subscriber,
  Subject,
  Subscription,
  ReplaySubject
} from "rxjs";
import { injectable, inject } from "inversify";

import {
  DeviceFacade,
  DeviceDriver,
  GenericHandTrackingData
} from "@/devices/generic";
import DIIdent from "@/dependencyinjection/symbols";
import { IStoreFactory, IStoreHolder, RootState } from "state/store";

import { getActiveRecording, HandTrackRecording } from "@/state/modules/record";
import { Store } from "vuex";

async function replayInfinite(
  subscriber: Subscriber<GenericHandTrackingData>,
  recordedData: HandTrackRecording
) {
  for (let i = 0; i < recordedData.recording.length; i++) {
    subscriber.next(recordedData.recording[i].data);
    if (i <= recordedData.recording.length - 2) {
      await new Promise(resolve =>
        window.setTimeout(
          resolve,
          recordedData.recording[i + 1].time - recordedData.recording[i].time
        )
      );
    } else {
      i = 0;
    }
  }
}

export function createFakeDeviceStream(
  recordedData: HandTrackRecording
): Observable<GenericHandTrackingData> {
  return Observable.create(
    async (subscriber: Subscriber<GenericHandTrackingData>) => {
      await replayInfinite(subscriber, recordedData);
    }
  );
}

@injectable()
export abstract class AbstractDeviceFacade implements DeviceFacade {
  private internalStream: Subject<GenericHandTrackingData> = new Subject();
  private fakeSubscription: Subscription | undefined;
  private realSubscription: Subscription | undefined;

  abstract getDeviceDriver(): DeviceDriver;
  abstract getDeviceTrackingData():
    | Observable<GenericHandTrackingData>
    | undefined;

  public notifyStreamSourceShouldUpdate(store: Store<RootState>) {
    this.updateStreamSources(store);
  }

  public getHandTrackingData(
    store: Store<RootState>
  ): Observable<GenericHandTrackingData> | undefined {
    this.updateStreamSources(store);
    return this.internalStream;
  }

  private clearSubscriptions() {
    if (this.realSubscription) {
      this.realSubscription.unsubscribe();
      this.realSubscription = undefined;
    }
    if (this.fakeSubscription) {
      this.fakeSubscription.unsubscribe();
      this.fakeSubscription = undefined;
    }
  }

  private updateStreamSources(store: Store<RootState>) {
    const recordedData = getActiveRecording(store);
    this.clearSubscriptions();
    if (recordedData) {
      if (!this.fakeSubscription) {
        this.fakeSubscription = createFakeDeviceStream(recordedData).subscribe(
          this.internalStream
        );
      }
    } else {
      const trackingData = this.getDeviceTrackingData();
      if (trackingData && !this.realSubscription) {
        this.realSubscription = trackingData.subscribe(this.internalStream);
      }
    }
  }
}
