import { injectable, inject } from "inversify";
import { Observable, BehaviorSubject } from "@reactivex/rxjs";

import LeapWorker from "worker-loader!./leapworker";
import {
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_ENABLE_CLASSIFICATION,
} from "./messages";
import DIIdent from "@/dependencyinjection/symbols";
import { GenericHandTrackingData, DeviceDriver, DeviceConnectionState, InitialDeviceState } from "@/devices/generic";
import { LEAP_MOTION_DEVICE_NAME } from '@/devices/leapmotion/leapdriver';

@injectable()
export class ThreadedLeap2Driver implements DeviceDriver {
  public deviceName = LEAP_MOTION_DEVICE_NAME;
  private worker: Worker;

  private deviceTrackingData: BehaviorSubject<GenericHandTrackingData> = new BehaviorSubject({
    data: {}
  } as GenericHandTrackingData);
  private deviceConnectionState: BehaviorSubject<DeviceConnectionState> =  new BehaviorSubject(
    InitialDeviceState as DeviceConnectionState
  );

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
    return Promise.resolve(this.deviceConnectionState.getValue())
  }

  public streamConnectionState(): Observable<DeviceConnectionState> {
    return this.deviceConnectionState.asObservable();
  }

  public establishConnection(): Observable<DeviceConnectionState> {
    this.worker.postMessage({cmd: WORKER_CMD_ESTABLISH_CONNECTION});
    return this.deviceConnectionState.asObservable();
  }

  public getTrackingData(): Observable<GenericHandTrackingData> {
    return this.deviceTrackingData;
  }

  public enableClassification(classifierIds: string[]) {
      this.worker.postMessage({ cmd: WORKER_CMD_ENABLE_CLASSIFICATION, payload: classifierIds });
  }

  private handleWorkerMessage(event: MessageEvent) {
    switch (event.data.type) {
      case WORKER_EVT_CONNECTION_STATE_CHANGED:
        return this.onConnectionStateChanged(event.data.payload);
      case WORKER_EVT_FINALIZED_FRAME_RECEIVED:
        return this.onFinalizedFrameReceived(event.data.payload);
    }
  }

  private onConnectionStateChanged(data: any) {
      this.deviceConnectionState.next(data);
  }

  private onFinalizedFrameReceived(data: any) {
    this.deviceTrackingData.next({ data })
  }
}