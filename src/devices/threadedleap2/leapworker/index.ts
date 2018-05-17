import { Subject, Observable } from "rxjs";

import {
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_UPDATE_PREPROCESS,
  WORKER_CMD_ENABLE_CLASSIFICATION,
  WorkerCommand,
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED,
  WORKER_CMD_UPDATE_CLASSIFIER,
  WORKER_CMD_DIGEST
} from "@/devices/threadedleap2/messages";
import {
  HardwareDriverConnectionSettings,
  InitialDeviceState,
  DeviceConnectionState,
  GenericHandTrackingData
} from "@/devices/generic";
import {
  LeapStatusWord,
  LeapDeviceFrame
} from "@/devices/leapmotion/leaptrackingdata";
import { ThreadedEngine } from "@/classify/engines/ThreadedEngine";
import { ThumbSpreadClassifier } from "@/classify/classifiers/thumbspread";
import { ClassifyResolver } from "@/classify/resolver";
import { PreProcessorConfig, PreProcessingEngine } from "@/processing/types";
import { PreProcessingResolver } from "@/processing/resolver";
import { DropNFramesOperator } from "@/processing/generic/dropnframes";
import { establishConnection } from "./connection";
import { updatePreprocessors } from "./preprocessing";
import { LeapWorkerContext } from "@/devices/threadedleap2/leapworker/types";
import { updateClassifier } from "./classification";

const initializeWorkerContext = (ctx: any): LeapWorkerContext => {
  ctx.pipeline = {
    deviceFrameSubject: new Subject(),
    outputSubject: new Subject(),
    preprocessSubject: new Subject(),
    classifySubject: new Subject()
  };
  ctx.lastFrameTime = 0;
  ctx.connectionState = InitialDeviceState;
  return ctx;
};

const ctx = initializeWorkerContext(self);

/**
 * Entry point of the Worker. From here, the various messages received
 * from the Browser Context get delegated to the various subcomponents
 * of the Worker implementation.
 */
ctx.onmessage = (event: MessageEvent) => {
  const message = event.data as WorkerCommand;

  switch (message.cmd) {
    case WORKER_CMD_ESTABLISH_CONNECTION:
      return establishConnection(ctx);
    case WORKER_CMD_UPDATE_CONFIGURATION:
      return updateConfiguration(message.payload, ctx);
    case WORKER_CMD_UPDATE_PREPROCESS:
      return updatePreprocessors(message.payload, ctx);
    case WORKER_CMD_UPDATE_CLASSIFIER:
      return updateClassifier(message.payload, ctx);
    case WORKER_CMD_DIGEST:
      return digest(message.payload, ctx);
  }
};

const digest = (payload: GenericHandTrackingData, ctx: LeapWorkerContext) => {
  ctx.pipeline.deviceFrameSubject.next(payload);
};

const updateConfiguration = (data: any, ctx: LeapWorkerContext) => {
  ctx.configuration = data;
};
