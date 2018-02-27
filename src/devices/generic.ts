import { Observable } from '@reactivex/rxjs';
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