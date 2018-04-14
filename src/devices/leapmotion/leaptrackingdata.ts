import { GenericHandTrackingData } from "..";

export interface LeapStatusWord {
  serviceVersion: string;
  version: number;
}

export interface LeapHandTrackingData extends GenericHandTrackingData {
  data: LeapDeviceFrame;
}

export interface LeapDeviceFrame {
  currentFrameRate: number;
  devices: any[];
  gestures: any[];
  hands: LeapHand[];
  id: number;
  interactionBox: LeapInteractionBox;
  pointables: LeapPointable[];
  r: number[][];
  s: number;
  t: number[];
  timestamp: number;
}

export interface LeapPointable {
  bases: number[][][];
  btipPosition: number[];
  carpPosition: number[];
  dipPosition: number[];
  direction: number[];
  extended: boolean;
  handId: number;
  id: number;
  length: number;
  mcpPosition: number[];
  pipPosition: number[];
  stabilizedTipPosition: number[];
  timeVisible: number;
  tipPosition: number[];
  tipVelocity: number[];
  tool: boolean;
  touchDistance: number;
  touchZone: string;
  type: number;
  width: number;
}

export interface LeapInteractionBox {
  center: number[];
  size: number[];
}

export interface LeapHand {
  armBasis: number[][];
  armWidth: number;
  confidence: number;
  direction: number[];
  elbow: number[];
  grabStrength: number;
  id: number;
  palmNormal: number[];
  palmPosition: number[];
  palmVelocity: number[];
  palmWidth: number;
  pinchStrength: number;
  r: number[][];
  s: number;
  sphereCenter: number[];
  sphereRadius: number;
  stabilizedPalmPosition: number[];
  t: number[];
  timeVisible: number;
  type: string;
  wrist: number[];
}
