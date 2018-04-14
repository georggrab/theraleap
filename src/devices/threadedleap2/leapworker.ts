import { WORKER_CMD_ESTABLISH_CONNECTION, WORKER_CMD_UPDATE_CONFIGURATION, WorkerCommand, WORKER_EVT_CONNECTION_STATE_CHANGED } from './messages';
import { HardwareDriverConnectionSettings, InitialDeviceState, DeviceConnectionState } from '@/devices/generic';
import { LeapStatusWord, LeapDeviceFrame } from '../leapmotion/leaptrackingdata';

const ctx: Worker = self as any;
let configuration: any | undefined = undefined;
let lastFrameTime = 0;
let deviceStreamingCheckIntervalId : number | undefined;
let connectionState: DeviceConnectionState = InitialDeviceState;

ctx.onmessage = (event: MessageEvent) => {
    const message = event.data as WorkerCommand;

    switch (message.cmd) {
        case WORKER_CMD_ESTABLISH_CONNECTION:
            return establishConnection();
        case WORKER_CMD_UPDATE_CONFIGURATION:
            return updateConfiguration(message.payload);
    }
}

const updateConfiguration = (data: any) => {
    console.log('Set Configuration:', data)
    configuration = data
}

const updateConnectionState = (state: Partial<DeviceConnectionState>) => {
    connectionState = { ...connectionState, ...state }
    ctx.postMessage({ type: WORKER_EVT_CONNECTION_STATE_CHANGED, payload: connectionState })
}

const processDeviceMessage = (message: string) => {
    const data: Object = JSON.parse(message);
    console.log(data);
    if (data.hasOwnProperty('serviceVersion')) {
        /* The Initial Frame from the Leap Motion Device Driver is always a Metadata Frame,
           which contains the serviceVersion of the Driver. We don't need it for now. */
        return; 
    } else {
        const frame = data as LeapDeviceFrame;
        lastFrameTime = Date.now();
    }
}

const handleNoConnection = () => {
    updateConnectionState({ nativeDeviceDriverOnline: false, connectedToNativeDeviceDriver: false, deviceHardwareConnected: undefined });
    if (deviceStreamingCheckIntervalId) {
        self.clearInterval(deviceStreamingCheckIntervalId);
    }
}

const enterConnectLoop = (timeout: number) => {
    const sock = new WebSocket(
        `ws://${configuration.host}:${configuration.port}`
    );
    sock.onerror = () => {
        handleNoConnection()
        setTimeout(enterConnectLoop.bind(self, timeout), timeout)
    }
    sock.onclose = handleNoConnection.bind(self);
    sock.onopen = () => {
        deviceStreamingCheckIntervalId = self.setInterval(() => {
            if (Date.now() - lastFrameTime > 1000) {
                updateConnectionState({ deviceHardwareConnected: false })
            } else {
                updateConnectionState({ deviceHardwareConnected: true })
            }
        }, 1000);
        updateConnectionState({ nativeDeviceDriverOnline: true, connectedToNativeDeviceDriver: true });
    }
    sock.onmessage = (ev: MessageEvent) => {
        console.log('Got message', ev)
        processDeviceMessage(ev.data);
    }
}

const establishConnection = () => {
    if (configuration === undefined) {
        console.warn('Can\'t establish Connection. Worker Thread has no Configuration.')
        return;
    }
    console.log('Establishing Connection to native device driver');
    enterConnectLoop(1000);
}