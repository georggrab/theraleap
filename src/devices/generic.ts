import { Observable, Subscriber } from "@reactivex/rxjs";
import { Store } from "vuex";
import { RootState } from "state/store";

/**
 * Represents to current connection State of the
 * Hand Tracking Device.
 */
export interface DeviceConnectionState {
  /**
   * Whether the underlying Device Driver is working properly and is online.
   * May be undefined if not currently known.
   */
  nativeDeviceDriverOnline: boolean | undefined;

  /**
   * Whether the Device is connected physically to the computer, and ready to use.
   * May be undefined if not currently known.
   */
  deviceHardwareConnected: boolean | undefined;

  /**
   * Whether the Abstract DeviceDriver is currently connected to the
   * Hardware Device driver.
   */
  connectedToNativeDeviceDriver: boolean;
}

export interface GenericHandTrackingData {
  data: any;
}

export interface HardwareDriverConnectionSettings {}

export const InitialDeviceState = {
  deviceHardwareConnected: undefined,
  connectedToNativeDeviceDriver: false,
  nativeDeviceDriverOnline: undefined
} as DeviceConnectionState;

export interface DeviceDriver {
  deviceName: string;

  getDeviceConnectionState: () => Promise<DeviceConnectionState>;
  streamConnectionState: () => Observable<DeviceConnectionState> | undefined;
  establishConnection: () => Observable<DeviceConnectionState>;
}

export interface DeviceFacade {
  getDeviceDriver: () => DeviceDriver;

  /**
   * This may be simulated data OR the data coming from the real hardware device,
   * depending on what is configured in the framework.
   */
  getHandTrackingData: (
    store: Store<RootState>
  ) => Observable<GenericHandTrackingData> | undefined;

  /**
   * Notify the DeviceFacade that the Stream source should be updated (like for example,
   * when switching from real data to a recording). This has to be done manually so the
   * update check does not have to be performed inside the Observable's onNext(), which
   * would be costly.
   */
  notifyStreamSourceShouldUpdate: (store: Store<RootState>) => void;

  /**
   * The Data coming from the real Hardware Device, or undefined if there
   * is a problem. You should probably use getHandTrackingData() instead, in order
   * to include simulated data!
   */
  getDeviceTrackingData: () => Observable<GenericHandTrackingData> | undefined;
}
