import { injectable, inject } from "inversify";
import { Observable, Subject, BehaviorSubject } from "rxjs";

import LeapWorker from "worker-loader!./leapworker/index.ts";
import {
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED,
  WORKER_EVT_CLASSIFICATION,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_UPDATE_PREPROCESS,
  WORKER_CMD_ENABLE_CLASSIFICATION,
  WORKER_CMD_UPDATE_CLASSIFIER,
  WORKER_CMD_DIGEST
} from "./messages";
import DIIdent from "@/dependencyinjection/symbols";
import {
  GenericHandTrackingData,
  DeviceDriver,
  DeviceConnectionState,
  InitialDeviceState
} from "@/devices/generic";
import { PreProcessorConfig } from "@/processing/types";
import { ClassifierConfig, ClassificationData } from "@/classify";

@injectable()
export class ThreadedLeap2Driver implements DeviceDriver {
  public deviceName = "Leap Motion";
  private worker: Worker;

  private deviceTrackingData: Subject<GenericHandTrackingData> = new Subject();
  private deviceConnectionState: BehaviorSubject<
    DeviceConnectionState
  > = new BehaviorSubject(InitialDeviceState as DeviceConnectionState);
  private classifySubject: Subject<ClassificationData> = new Subject();

  constructor(
    @inject(DIIdent.SETTINGS_HARDWARE_DRIVER_CONNECTION)
    private controllerSettings: any
  ) {
    this.worker = new LeapWorker();
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.worker.postMessage({
      cmd: WORKER_CMD_UPDATE_CONFIGURATION,
      payload: controllerSettings
    });
  }

  public getDeviceConnectionState(): Promise<DeviceConnectionState> {
    return Promise.resolve(this.deviceConnectionState.getValue());
  }

  public streamConnectionState(): Observable<DeviceConnectionState> {
    return this.deviceConnectionState.asObservable();
  }

  public establishConnection(): Observable<DeviceConnectionState> {
    this.worker.postMessage({ cmd: WORKER_CMD_ESTABLISH_CONNECTION });
    return this.deviceConnectionState.asObservable();
  }

  public getTrackingData(): Observable<GenericHandTrackingData> {
    return this.deviceTrackingData;
  }

  public enableClassification(classifierIds: string[]) {
    this.worker.postMessage({
      cmd: WORKER_CMD_ENABLE_CLASSIFICATION,
      payload: classifierIds
    });
  }

  public updatePreProcessors(configs: PreProcessorConfig[]) {
    this.worker.postMessage({
      cmd: WORKER_CMD_UPDATE_PREPROCESS,
      payload: configs
    });
    return true;
  }

  public updateClassifier(config: ClassifierConfig) {
    this.worker.postMessage({
      cmd: WORKER_CMD_UPDATE_CLASSIFIER,
      payload: config
    });
    return true;
  }

  public digest(data: GenericHandTrackingData) {
    this.worker.postMessage({
      cmd: WORKER_CMD_DIGEST,
      payload: data
    });
  }

  public getClassificationData() {
    return this.classifySubject;
  }

  private handleWorkerMessage(event: MessageEvent) {
    switch (event.data.type) {
      case WORKER_EVT_CONNECTION_STATE_CHANGED:
        return this.onConnectionStateChanged(event.data.payload);
      case WORKER_EVT_FINALIZED_FRAME_RECEIVED:
        return this.onFinalizedFrameReceived(event.data.payload);
      case WORKER_EVT_CLASSIFICATION:
        return this.onClassificationReceived(event.data.payload);
    }
  }

  private onConnectionStateChanged(data: any) {
    this.deviceConnectionState.next(data);
  }

  private onClassificationReceived(data: any) {
    this.classifySubject.next(data);
  }

  private onFinalizedFrameReceived(data: any) {
    this.deviceTrackingData.next(data);
  }
}
