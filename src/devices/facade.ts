import {
  Observable,
  Subscriber,
  Subject,
  Subscription,
  ReplaySubject
} from "rxjs";
import { Store } from "vuex";
import { injectable, inject } from "inversify";

import {
  DeviceFacade,
  DeviceDriver,
  GenericHandTrackingData
} from "@/devices/generic";
import DIIdent from "@/dependencyinjection/symbols";
import { IStoreFactory, IStoreHolder, RootState } from "@/state/store";

import { getActiveRecording, HandTrackRecording } from "@/state/modules/record";
import { PreProcessorConfig } from "@/processing/types";
import { ClassifierConfig } from "@/classify";

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
  private fakeSubscription: Subscription | undefined;

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
    return this.getDeviceTrackingData();
  }

  private clearSubscriptions() {
    if (this.fakeSubscription) {
      this.fakeSubscription.unsubscribe();
      this.fakeSubscription = undefined;
    }
  }

  private updateStreamSources(store: Store<RootState>) {
    const recordedData = getActiveRecording(store);
    this.clearSubscriptions();
    if (recordedData) {
      this.fakeSubscription = createFakeDeviceStream(recordedData).subscribe(
        fakeData => {
          this.getDeviceDriver().digest(fakeData);
        }
      );
    }
  }

  public updatePreProcessors(configs: PreProcessorConfig[]) {
    this.getDeviceDriver().updatePreProcessors(configs);
  }

  public updateClassifier(config: ClassifierConfig) {
    this.getDeviceDriver().updateClassifier(config);
  }
}
