import { GenericHandTrackingData } from "@/devices";

export interface HandRenderer<T extends GenericHandTrackingData> {
  initializeScene: () => GraphicalHandLoggerScene;
  render: (data: T, scene: GraphicalHandLoggerScene) => void;
}

/**
 * Represents the whole Scene involving Hands
 */
export interface GraphicalHandLoggerScene {
  multipleHandScene: MultiHandScene;
}

/** Represents a single Hand */
export interface HandScene {
  palm: THREE.Object3D;
  fingers: MultiFingerScene;
  palmNormalVector?: THREE.Line;
  palmDirectionalVector?: THREE.Line;
  readonly config: HandConfig;
}

/** Represents multiple Finger Objects */
export type MultiFingerScene = { [fingerType: number]: THREE.Object3D };

/** Represents multiple Hand Objects */
export interface MultiHandScene {
  hands: { [handType: string]: HandScene };
  projectionFrom: Projection3;
  projectionTo: Projection3;
  nativeSceneRef: THREE.Scene;
}

export interface Projection3 {
  min: number[];
  max: number[];
}

export interface HandConfig {
  mainColor: number;
  emissiveColor: number;
  drawWireFrame: boolean;
  drawNormalVector: boolean;
  drawDirectionalVector: boolean;
}
