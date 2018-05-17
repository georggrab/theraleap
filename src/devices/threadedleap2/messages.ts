export const WORKER_CMD_ESTABLISH_CONNECTION = "EstablishConnection";
export const WORKER_CMD_UPDATE_CONFIGURATION = "UpdateConfiguration";
export const WORKER_CMD_UPDATE_PREPROCESS = "UpdatePreProcess";
export const WORKER_CMD_ENABLE_CLASSIFICATION = "EnableClassification";
export const WORKER_CMD_UPDATE_CLASSIFIER = "UpdateClassifier";
export const WORKER_CMD_DIGEST = "Digest";
export const WORKER_EVT_CONNECTION_STATE_CHANGED = "OnConnectionStateChanged";
export const WORKER_EVT_FINALIZED_FRAME_RECEIVED = "OnFinalizedFrameReceived";

export interface WorkerCommand {
  cmd: string;
  payload?: any;
}

export interface WorkerEvent {
  evt: string;
  payload: any;
}
