import { inject, injectable } from "inversify";
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscriber,
  Subscription
} from "rxjs";
import { Store } from "vuex";

import DIIdent from "@/dependencyinjection/symbols";
import {
  DeviceDriver,
  DeviceFacade,
  GenericHandTrackingData
} from "@/devices/generic";
import { IStoreFactory, IStoreHolder, RootState } from "@/state/store";

import { ClassifierConfig } from "@/classify";
import { PreProcessorConfig } from "@/processing/types";
import { getActiveRecording, HandTrackRecording } from "@/state/modules/record";

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

  public abstract getDeviceDriver(): DeviceDriver;
  public abstract getDeviceTrackingData():
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

  public updatePreProcessors(configs: PreProcessorConfig[]) {
    this.getDeviceDriver().updatePreProcessors(configs);
  }

  public updateClassifier(config: ClassifierConfig) {
    this.getDeviceDriver().updateClassifier(config);
  }

  public getClassificationStream() {
    return this.getDeviceDriver().getClassificationData();
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
    if (recordedData !== undefined) {
      this.fakeSubscription = createFakeDeviceStream(recordedData).subscribe(
        fakeData => {
          this.getDeviceDriver().digest(fakeData);
        }
      );
    } else {
      if (this.fakeSubscription) {
        this.fakeSubscription.unsubscribe();
      }
    }
  }
}
