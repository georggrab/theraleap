/**
 * Represents the whole Scene involving Hands
 */
export interface GraphicalHandLoggerScene {
    multipleHandScene: MultiHandScene
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
export type MultiFingerScene = {[fingerType: number]: THREE.Object3D}

/** Represents multiple Hand Objects */
export type MultiHandScene = {[handType: string]: HandScene}

export interface HandConfig {
    mainColor: number;
    emissiveColor: number;
    drawWireFrame: boolean;
    drawNormalVector: boolean;
    drawDirectionalVector: boolean;
}