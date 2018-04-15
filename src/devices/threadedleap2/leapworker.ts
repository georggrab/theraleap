import { Subject } from "rxjs";

import {
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_ENABLE_CLASSIFICATION,
  WorkerCommand,
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED
} from "./messages";
import {
  HardwareDriverConnectionSettings,
  InitialDeviceState,
  DeviceConnectionState,
  GenericHandTrackingData
} from "@/devices/generic";
import {
  LeapStatusWord,
  LeapDeviceFrame
} from "../leapmotion/leaptrackingdata";
import { ThreadedEngine } from "classify/engines/ThreadedEngine";
import { ThumbSpreadClassifier } from "classify/classifiers/thumbspread";
import { resolveClassifier } from "classify/resolver";

const ctx: Worker = self as any;
let deviceFrameSubject: Subject<GenericHandTrackingData> | undefined;
let engine: ThreadedEngine | undefined;
let configuration: any | undefined = undefined;
let lastFrameTime = 0;
let deviceStreamingCheckIntervalId: number | undefined;
let connectionState: DeviceConnectionState = InitialDeviceState;

ctx.onmessage = (event: MessageEvent) => {
  const message = event.data as WorkerCommand;

  switch (message.cmd) {
    case WORKER_CMD_ESTABLISH_CONNECTION:
      return establishConnection();
    case WORKER_CMD_UPDATE_CONFIGURATION:
      return updateConfiguration(message.payload);
    case WORKER_CMD_ENABLE_CLASSIFICATION:
      return startClassificationEngine(message.payload);
  }
};

const startClassificationEngine = (classifierIds: string[]) => {
    deviceFrameSubject = new Subject();
    engine = new ThreadedEngine(self as any);
    classifierIds.forEach((id) => {
        const classifier = resolveClassifier(id);
        if (classifier) {
            engine!.addClassifier(classifier);
        } else {
            console.warn('Unknown Classifier', id);
        }
    });
    engine.process(deviceFrameSubject);
}

const updateConfiguration = (data: any) => {
  console.log("Set Configuration:", data);
  configuration = data;
};

const updateConnectionState = (state: Partial<DeviceConnectionState>) => {
  connectionState = { ...connectionState, ...state };
  ctx.postMessage({
    type: WORKER_EVT_CONNECTION_STATE_CHANGED,
    payload: connectionState
  });
};

const processDeviceMessage = (message: string, socket: WebSocket) => {
  const data: Object = JSON.parse(message);
  if (data.hasOwnProperty("serviceVersion")) {
    /* The Initial Frame from the Leap Motion Device Driver is always a Metadata Frame,
           which contains the serviceVersion of the Driver. When this frame arrives, we'll reply
           with the device settings. */
    [
      {
        enableGestures:
          configuration.enableGestures !== undefined
            ? configuration.enableGestures
            : false
      },
      {
        background:
          configuration.background !== undefined
            ? configuration.background
            : false
      },
      {
        optimizeHMD:
          configuration.optimizeHMD !== undefined
            ? configuration.optimizeHMD
            : false
      },
      {
        focused:
          configuration.focused !== undefined ? configuration.focused : true
      }
    ].forEach(setting => {
      socket.send(JSON.stringify(setting));
    });
  } else {
    const frame = data as LeapDeviceFrame;
    lastFrameTime = Date.now();
    ctx.postMessage({
      type: WORKER_EVT_FINALIZED_FRAME_RECEIVED,
      payload: frame
    });
    if (deviceFrameSubject) {
        deviceFrameSubject.next({ data: frame });
    }
  }
};

const handleNoConnection = () => {
  updateConnectionState({
    nativeDeviceDriverOnline: false,
    connectedToNativeDeviceDriver: false,
    deviceHardwareConnected: undefined
  });
  if (deviceStreamingCheckIntervalId) {
    self.clearInterval(deviceStreamingCheckIntervalId);
  }
};

const enterConnectLoop = (timeout: number) => {
  const sock = new WebSocket(
    `ws://${configuration.host}:${configuration.port}/v7.json`
  );
  sock.onerror = () => {
    handleNoConnection();
    setTimeout(enterConnectLoop.bind(self, timeout), timeout);
  };
  sock.onclose = handleNoConnection.bind(self);
  sock.onopen = () => {
    deviceStreamingCheckIntervalId = self.setInterval(() => {
      if (Date.now() - lastFrameTime > 1000) {
        updateConnectionState({ deviceHardwareConnected: false });
      } else {
        updateConnectionState({ deviceHardwareConnected: true });
      }
    }, 1000);
    updateConnectionState({
      nativeDeviceDriverOnline: true,
      connectedToNativeDeviceDriver: true
    });
  };
  sock.onmessage = (ev: MessageEvent) => {
    processDeviceMessage(ev.data, sock);
  };
};

const establishConnection = () => {
  if (configuration === undefined) {
    console.warn(
      "Can't establish Connection. Worker Thread has no Configuration."
    );
    return;
  }
  console.log("Establishing Connection to native device driver");
  enterConnectLoop(1000);
};