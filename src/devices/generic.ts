import { Observable, Subscriber } from "rxjs";
import { Store } from "vuex";

import { ClassificationData, ClassifierConfig } from "@/classify";
import { PreProcessorConfig } from "@/processing/types";
import { RootState } from "@/state/store";

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

export const InitialDeviceState: DeviceConnectionState = {
  connectedToNativeDeviceDriver: false,
  deviceHardwareConnected: undefined,
  nativeDeviceDriverOnline: undefined
};

export interface DeviceDriver {
  deviceName: string;

  /** Returns the current ConnectionState */
  getDeviceConnectionState: () => Promise<DeviceConnectionState>;

  /** Returns a Stream of ConnectionStates */
  streamConnectionState: () => Observable<DeviceConnectionState> | undefined;

  /** Attempts to establish the connection to the native driver. Returns a stream of Connectionstates. */
  establishConnection: () => Observable<DeviceConnectionState>;

  /** Returns an Observable Stream of eventually preprocessed HandtrackingData */
  getTrackingData: () => Observable<GenericHandTrackingData>;

  /** Returns a Stream of ClassificationData, or undefined if Classification is not supported by the driver. */
  getClassificationData: () => Observable<ClassificationData> | undefined;

  /** configure a List of classifiers. Currently, only one will be used. */
  enableClassification: (classifiers: string[]) => void;

  /**
   * Apply the Preprocessors as specified by the Configuration Map.
   * Returns false if Preprocessors are not supported by the device
   * driver.
   */
  updatePreProcessors: (configs: PreProcessorConfig[]) => boolean;

  /**
   * Apply Classifier as specified by the Configuration.
   * Returns false if Classification is not supported by the
   * device driver.
   */
  updateClassifier: (config: ClassifierConfig) => boolean;

  /**
   * Feed arbitrary GenericHandTrackingData into the driver
   */
  digest: (data: GenericHandTrackingData) => void;
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

  /**
   * The Classification Stream
   */
  getClassificationStream: () => Observable<ClassificationData> | undefined;

  /**
   * The Frame PreProcessors selected by the user.
   */
  updatePreProcessors: (x: PreProcessorConfig[]) => void;

  /**
   * The Classifier selected by the user
   */
  updateClassifier: (x: ClassifierConfig) => void;
}
