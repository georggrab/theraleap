import { inject, injectable } from "inversify";
import * as leap from "leapjs";
import { fromEvent, Observable, Observer, Subject, Subscription } from "rxjs";
import { isEqual } from "underscore";

import { ClassifierConfig } from "@/classify";
import DIIdent from "@/dependencyinjection/symbols";
import {
  DeviceConnectionState,
  DeviceDriver,
  GenericHandTrackingData
} from "@/devices";
import { PreProcessorConfig } from "@/processing/types";

export const LEAP_MOTION_DEVICE_NAME = "Leap Motion";

@injectable()
export class LeapDriver implements DeviceDriver {
  public deviceName = LEAP_MOTION_DEVICE_NAME;

  private controller: leap.Controller;
  private monitor: Observable<DeviceConnectionState> | undefined;
  private connectionActive: boolean = false;
  private deviceConnected: boolean | undefined;

  private outputSubject: Subject<GenericHandTrackingData>;
  private frameStreamSubscription: Subscription;

  constructor(
    @inject(DIIdent.SETTINGS_HARDWARE_DRIVER_CONNECTION)
    private controllerSettings: any
  ) {
    this.controller = new leap.Controller(controllerSettings);
    this.controller.on("connect", () => (this.connectionActive = true));
    this.controller.on("disconnect", () => (this.connectionActive = false));
    this.controller.on("deviceConnected", () => (this.deviceConnected = true));
    this.controller.on(
      "deviceDisconnected",
      () => (this.deviceConnected = false)
    );
    this.outputSubject = new Subject<GenericHandTrackingData>();
    this.frameStreamSubscription = (fromEvent(
      this.controller,
      "frame"
    ) as Observable<GenericHandTrackingData>).subscribe(this.outputSubject);
  }

  public async isLeapServerRunning(maxWaitTimeInMs: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const sock = new WebSocket(
        `ws://${this.controllerSettings.host}:${this.controllerSettings.port}`
      );

      const hdl = window.setTimeout(() => {
        if (sock.readyState === sock.OPEN) {
          resolve(true);
          sock.close();
        } else {
          resolve(false);
        }
      }, maxWaitTimeInMs);

      sock.onerror = () => {
        resolve(false);
        window.clearTimeout(hdl);
      };
    });
  }

  public enableClassification(classifiers: string[]) {
    // TODO implement non threaded classification
    throw new Error("Not Implemented");
  }

  public getClassificationData() {
    // TODO classification is not yet supported by the non threaded driver.
    return undefined;
  }

  public async getDeviceConnectionState(): Promise<DeviceConnectionState> {
    const state: DeviceConnectionState = {
      connectedToNativeDeviceDriver: this.connectionActive,
      deviceHardwareConnected: this.connectionActive
        ? this.controller.streaming()
        : undefined,
      nativeDeviceDriverOnline: await this.isLeapServerRunning(1000)
    };
    return state;
  }

  public establishConnection(
    monitoringInterval: number = 1500
  ): Observable<DeviceConnectionState> {
    this.monitor = Observable.create(
      async (observer: Observer<DeviceConnectionState>) => {
        this.connect();
        let previousConnectionState = await this.getDeviceConnectionState();
        observer.next(previousConnectionState);
        window.setInterval(async () => {
          const connectionState = await this.getDeviceConnectionState();
          if (!isEqual(connectionState, previousConnectionState)) {
            previousConnectionState = connectionState;
            this.connect();
            observer.next(connectionState);
          }
        }, monitoringInterval);
      }
    );
    return this.monitor as Observable<DeviceConnectionState>;
  }

  public streamConnectionState():
    | Observable<DeviceConnectionState>
    | undefined {
    return this.monitor;
  }

  public getTrackingData(): Observable<GenericHandTrackingData> {
    return this.outputSubject;
  }

  public async connect(): Promise<boolean> {
    this.controller.disconnect();
    return new Promise((resolve: (v: boolean) => void) => {
      this.controller.once("connect", () => {
        this.connectionActive = true;
        resolve(true);
      });
      this.controller.connect();
    });
  }

  public updatePreProcessors(configs: PreProcessorConfig[]) {
    return false;
  }

  public updateClassifier(config: ClassifierConfig) {
    return false;
  }

  public digest(data: GenericHandTrackingData) {
    this.outputSubject.next(data);
  }
}
