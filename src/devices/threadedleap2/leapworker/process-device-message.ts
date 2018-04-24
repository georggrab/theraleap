import { LeapWorkerContext } from './types';
import { LeapDeviceFrame } from '@/devices/leapmotion/leaptrackingdata';

export const processDeviceMessage = (message: string, socket: WebSocket, ctx: LeapWorkerContext) => {
  const data: Object = JSON.parse(message);
  if (data.hasOwnProperty("serviceVersion")) {
    /* The Initial Frame from the Leap Motion Device Driver is always a Metadata Frame,
           which contains the serviceVersion of the Driver. When this frame arrives, we'll reply
           with the device settings. */
    [
      {
        enableGestures:
          ctx.configuration.enableGestures !== undefined
            ? ctx.configuration.enableGestures
            : false
      },
      {
        background:
          ctx.configuration.background !== undefined
            ? ctx.configuration.background
            : false
      },
      {
        optimizeHMD:
          ctx.configuration.optimizeHMD !== undefined
            ? ctx.configuration.optimizeHMD
            : false
      },
      {
        focused:
          ctx.configuration.focused !== undefined ? ctx.configuration.focused : true
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
    ctx.lastFrameTime = Date.now();
    if (ctx.pipeline.deviceFrameSubject) {
        ctx.pipeline.deviceFrameSubject.next({ data: frame });
    }
  }
};