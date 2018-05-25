import { Observable, Subject } from "rxjs";

import { ThumbSpreadClassifier } from "@/classify/classifiers/thumbspread";
import { ClassifyResolver } from "@/classify/resolver";
import {
  DeviceConnectionState,
  GenericHandTrackingData,
  HardwareDriverConnectionSettings,
  InitialDeviceState
} from "@/devices/generic";
import {
  LeapDeviceFrame,
  LeapStatusWord
} from "@/devices/leapmotion/leaptrackingdata";
import { LeapWorkerContext } from "@/devices/threadedleap2/leapworker/types";
import {
  WORKER_CMD_DIGEST,
  WORKER_CMD_ENABLE_CLASSIFICATION,
  WORKER_CMD_ESTABLISH_CONNECTION,
  WORKER_CMD_UPDATE_CLASSIFIER,
  WORKER_CMD_UPDATE_CONFIGURATION,
  WORKER_CMD_UPDATE_PREPROCESS,
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED,
  WorkerCommand
} from "@/devices/threadedleap2/messages";
import { DropNFramesOperator } from "@/processing/generic/dropnframes";
import { PreProcessingResolver } from "@/processing/resolver";
import { PreProcessingEngine, PreProcessorConfig } from "@/processing/types";
import { updateClassifier } from "./classification";
import { establishConnection } from "./connection";
import { updatePreprocessors } from "./preprocessing";

const initializeWorkerContext = (ctx: any): LeapWorkerContext => {
  ctx.pipeline = {
    classifySubject: new Subject(),
    deviceFrameSubject: new Subject(),
    outputSubject: new Subject(),
    preprocessSubject: new Subject()
  };
  ctx.lastFrameTime = 0;
  ctx.connectionState = InitialDeviceState;
  return ctx;
};

const context = initializeWorkerContext(self);

/**
 * Entry point of the Worker. From here, the various messages received
 * from the Browser Context get delegated to the various subcomponents
 * of the Worker implementation.
 */
context.onmessage = (event: MessageEvent) => {
  const message = event.data as WorkerCommand;

  switch (message.cmd) {
    case WORKER_CMD_ESTABLISH_CONNECTION:
      return establishConnection(context);
    case WORKER_CMD_UPDATE_CONFIGURATION:
      return updateConfiguration(message.payload, context);
    case WORKER_CMD_UPDATE_PREPROCESS:
      return updatePreprocessors(message.payload, context);
    case WORKER_CMD_UPDATE_CLASSIFIER:
      return updateClassifier(message.payload, context);
    case WORKER_CMD_DIGEST:
      return digest(message.payload, context);
  }
};

const digest = (payload: GenericHandTrackingData, ctx: LeapWorkerContext) => {
  ctx.pipeline.deviceFrameSubject.next(payload);
};

const updateConfiguration = (data: any, ctx: LeapWorkerContext) => {
  ctx.configuration = data;
};
