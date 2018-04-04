import { Observable, Subscriber } from '@reactivex/rxjs';

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

export interface HardwareDriverConnectionSettings { }

export const InitialDeviceState = { 
    deviceHardwareConnected: undefined, 
    connectedToNativeDeviceDriver: false, 
    nativeDeviceDriverOnline: undefined 
} as DeviceConnectionState

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
     * depending on what is configured in the framework. This function should
     * always be used instead of getDeviceTrackingData() unless there is a REALLY
     * good reason not to. 
     */
    getHandTrackingData: () => Observable<GenericHandTrackingData> | undefined;

    /**
     * The Data coming from the real Hardware Device, or undefined if there
     * is a problem. You should probably use getHandTrackingData() instead, in order
     * to include simulated data!
     */
    getDeviceTrackingData: () => Observable<GenericHandTrackingData> | undefined;
}