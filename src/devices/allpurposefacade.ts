import { inject, injectable, LazyServiceIdentifer } from "inversify";
import { Observable } from "rxjs";

import DIIdent from "@/dependencyinjection/symbols";
import { AbstractDeviceFacade } from "@/devices/facade";
import {
  DeviceConnectionState,
  DeviceDriver,
  DeviceFacade,
  GenericHandTrackingData
} from "@/devices/generic";
import { IStoreFactory, IStoreHolder } from "state/store";

@injectable()
export class AllPurposeRecordingFacade extends AbstractDeviceFacade {
  private handTrackingDataStream:
    | Observable<GenericHandTrackingData>
    | undefined;

  constructor(
    @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
    private deviceDriver: DeviceDriver
  ) {
    super();
  }

  public getDeviceDriver(): DeviceDriver {
    return this.deviceDriver;
  }

  public getDeviceTrackingData(): Observable<GenericHandTrackingData> {
    if (!this.handTrackingDataStream) {
      this.handTrackingDataStream = this.deviceDriver.getTrackingData();
    }
    return this.handTrackingDataStream;
  }
}
