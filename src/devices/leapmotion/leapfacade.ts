import { injectable, inject, LazyServiceIdentifer } from "inversify";
import { Observable } from "@reactivex/rxjs";

import {
  DeviceDriver,
  DeviceConnectionState,
  DeviceFacade,
  GenericHandTrackingData
} from "@/devices/generic";
import { AbstractDeviceFacade } from "@/devices/facade";
import { LeapDriver } from "./leapdriver";
import DIIdent from "@/dependencyinjection/symbols";
import { IStoreFactory, IStoreHolder } from "state/store";

@injectable()
export class LeapFacade extends AbstractDeviceFacade {
  private handTrackingDataStream:
    | Observable<GenericHandTrackingData>
    | undefined;

  constructor(
    @inject(DIIdent.SERVICE_MOTION_TRACKING_DEVICE_DRIVER)
    private leapDriver: LeapDriver
  ) {
    super();
  }

  public getDeviceDriver(): DeviceDriver {
    return this.leapDriver as DeviceDriver;
  }

  public getDeviceTrackingData(): Observable<GenericHandTrackingData> {
    if (!this.handTrackingDataStream) {
      this.handTrackingDataStream = this.leapDriver.setUpFrameStream();
    }
    return this.handTrackingDataStream;
  }
}
