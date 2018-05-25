import * as THREE from "three";

import { LeapHandTrackingData, LeapInteractionBox } from "@/devices/leapmotion";
import { HandScene, MultiHandScene } from "@/ui/graphics/types";

/**
 * Compares an incoming Leap Motion Frame to the current state of the Scene.
 * If the incoming Frame does NOT contain objects that ARE currently painted in
 * the scene, delete them from the scene and clean up the internal state.
 * @param frame The Frame to compare to
 * @param scene The current multihand scene state
 */
export function deleteStaleHands(
  frame: LeapHandTrackingData,
  scene: MultiHandScene
): { [_: string]: HandScene } {
  const shownHands = frame.data.hands.map(hand => hand.type);
  const validHands: { [s: string]: HandScene } = {};

  /** Delete the Hand Objects that are not in this frame from the native THREE scene */
  Object.entries(scene.hands).forEach(([type, sceneHand]) => {
    if (!shownHands.includes(type)) {
      scene.nativeSceneRef.remove(
        sceneHand.palm,
        ...Object.values(sceneHand.fingers)
      );
    }
  });

  /** Build and return new HandScenes containing only the valid (i.e., contained in this frame) Scenes */
  shownHands.forEach(shownHand => {
    if (scene.hands.hasOwnProperty(shownHand)) {
      validHands[shownHand] = scene.hands[shownHand];
    }
  });

  return validHands;
}

/**
 * Based on the ProjectionBox coming from the Device, update the scene states
 * projection matrix accordingly. This Matrix is used in order to cast the point data
 * coming from the device into the correct coordinate system used by the graphical logger
 * @param iBox The Interactionbox coming from the device
 * @param scene The Scene state to alter
 */
export function setProjection(iBox: LeapInteractionBox, scene: MultiHandScene) {
  const min = [];
  const max = [];
  for (const i in [0, 1, 2]) {
    min.push(iBox.center[i] - iBox.size[i] / 2);
    max.push(iBox.center[i] + iBox.size[i] / 2);
  }
  scene.projectionFrom = { min, max };
  scene.projectionTo = { min: [0, 0, 0], max: [50, 50, 50] };
}

/**
 * Create a 3d THREE Vector Object pointing from the center of the
 * THREE Coordinate System to the coordinate (10, 10, 10). Used to
 * initialize Vector Objects
 */
export function makeLineVector(): THREE.Line {
  return new THREE.Line(
    new THREE.Geometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 10, 10)
    ]),
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  );
}
