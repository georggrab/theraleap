import { DeviceConnectionState } from "@/devices/generic";
import { LeapWorkerContext } from "@/devices/threadedleap2/leapworker/types";
import {
  WORKER_EVT_CONNECTION_STATE_CHANGED,
  WORKER_EVT_FINALIZED_FRAME_RECEIVED
} from "@/devices/threadedleap2/messages";
import { initializePreProcessingPipeline } from "./preprocessing";
import { processDeviceMessage } from "./process-device-message";

export const handleNoConnection = (ctx: LeapWorkerContext) => {
  updateConnectionState(
    {
      connectedToNativeDeviceDriver: false,
      deviceHardwareConnected: undefined,
      nativeDeviceDriverOnline: false
    },
    ctx
  );
  if (ctx.deviceStreamingIntervalId) {
    self.clearInterval(ctx.deviceStreamingIntervalId);
  }
};

export const updateConnectionState = (
  state: Partial<DeviceConnectionState>,
  ctx: LeapWorkerContext
) => {
  ctx.connectionState = { ...ctx.connectionState, ...state };
  ctx.postMessage({
    payload: ctx.connectionState,
    type: WORKER_EVT_CONNECTION_STATE_CHANGED
  });
};

export const enterConnectLoop = (timeout: number, ctx: LeapWorkerContext) => {
  const sock = new WebSocket(
    `ws://${ctx.configuration.host}:${ctx.configuration.port}/v7.json`
  );
  sock.onerror = () => {
    handleNoConnection(ctx);
    setTimeout(enterConnectLoop.bind(self, timeout, ctx), timeout);
  };
  sock.onclose = handleNoConnection.bind(self, ctx);
  sock.onopen = () => {
    ctx.deviceStreamingIntervalId = self.setInterval(() => {
      if (Date.now() - ctx.lastFrameTime > 1000) {
        updateConnectionState({ deviceHardwareConnected: false }, ctx);
      } else {
        updateConnectionState({ deviceHardwareConnected: true }, ctx);
      }
    }, 1000);
    updateConnectionState(
      {
        connectedToNativeDeviceDriver: true,
        nativeDeviceDriverOnline: true
      },
      ctx
    );
  };
  sock.onmessage = (ev: MessageEvent) => {
    processDeviceMessage(ev.data, sock, ctx);
  };
};

export const establishConnection = (ctx: LeapWorkerContext) => {
  initializePreProcessingPipeline(ctx);
  ctx.pipeline.outputSubject.subscribe(next => {
    ctx.postMessage({
      payload: next,
      type: WORKER_EVT_FINALIZED_FRAME_RECEIVED
    });
  });
  if (ctx.configuration === undefined) {
    console.warn(
      "Can't establish Connection. Worker Thread has no Configuration."
    );
    return;
  }
  console.log("Establishing Connection to native device driver");
  enterConnectLoop(1000, ctx);
};
