import { Subject, Observable } from "rxjs";

import {
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_UPDATE_PREPROCESS,
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
import { PreProcessorConfig, PreProcessingEngine } from '@/processing/types';
import { PreProcessingResolver } from "processing/resolver";
import { DropNFramesOperator } from "processing/generic/dropnframes";

const ctx: Worker = self as any;

const withPreProcessorEngine = (e: PreProcessingEngine) => (source: Observable<GenericHandTrackingData>) =>
    e.applyPreProcessors(source);

const deviceFrameSubject: Subject<GenericHandTrackingData> = new Subject();
const outputSubject = new Subject();
let preprocessSubject: Subject<GenericHandTrackingData> = new Subject();
let deviceFrameSubscription = deviceFrameSubject.subscribe(preprocessSubject);
let preprocessSubscription = preprocessSubject.subscribe(outputSubject);
  
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
    case WORKER_CMD_UPDATE_PREPROCESS:
      return updatePreprocessors(message.payload);
  }
};

const updatePreprocessors = (config: PreProcessorConfig[]) => {
  console.log('updating preprocessors')
  preprocessSubscription.unsubscribe();
  deviceFrameSubscription.unsubscribe();
  // @ts-ignore
  preprocessSubject = new Subject<GenericHandTrackingData>()
    .pipe(...config.map(x => 
        (source: Observable<GenericHandTrackingData>) => 
          source.lift(PreProcessingResolver(x))));
  preprocessSubscription = preprocessSubject.subscribe(outputSubject);
  deviceFrameSubscription = deviceFrameSubject.subscribe(preprocessSubject);
}

const startClassificationEngine = (classifierIds: string[]) => {
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
  } else if (data.hasOwnProperty("event")) {
    /** The Device sends events through the same Data Stream. They are
     *  indicated by the "event" key.
     */
  } else {
    /** The rest of the Data is the thing we're interested in: Device Frames. */
    const frame = data as LeapDeviceFrame;
    lastFrameTime = Date.now();
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
  outputSubject.subscribe((next) => {
    ctx.postMessage({
      type: WORKER_EVT_FINALIZED_FRAME_RECEIVED,
      payload: next
    });
  })
  if (configuration === undefined) {
    console.warn(
      "Can't establish Connection. Worker Thread has no Configuration."
    );
    return;
  }
  console.log("Establishing Connection to native device driver");
  enterConnectLoop(1000);
};