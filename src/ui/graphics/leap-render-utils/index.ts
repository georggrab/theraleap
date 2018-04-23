import { LeapHand, LeapHandTrackingData, LeapPointable } from "@/devices/leapmotion";
import { HandConfig, MultiHandScene } from '@/ui/graphics/types';

import { deleteStaleHands, setProjection } from './utils';
import { initializePalm, updatePalmPosition, updatePalmAlign, updatePalmNormalVector } from './palm';
import { initializeFinger, updateFinger } from './finger';

/**
 * Object containing the Default Hand Configuration.
 */
export const DefaultHandConfig: HandConfig = {
  mainColor: 0x156289,
  emissiveColor: 0x072534,
  drawWireFrame: true,
  drawDirectionalVector: true,
  drawNormalVector: true
};

export function initializeScene(nativeSceneRef: THREE.Scene): MultiHandScene {
  return { nativeSceneRef, hands: {} } as MultiHandScene;
}

export function render(frame: LeapHandTrackingData, scene: MultiHandScene, config: Partial<HandConfig>) {
  const mergedConfig = {...DefaultHandConfig, ...config};

  setProjection(frame.data.interactionBox, scene);
  scene.hands = deleteStaleHands(frame, scene)

  frame.data.hands.forEach(hand => {
    renderHand(hand, scene, mergedConfig);

    frame.data.pointables
      .filter(pointable => pointable.handId === hand.id)
      .forEach(pointable => {
        renderFinger(hand.type, pointable, scene, mergedConfig);
      });
  });
}

export function renderHand(hand: LeapHand, scene: MultiHandScene, config: HandConfig) {
  if (!scene.hands[hand.type]) {
    scene.hands[hand.type] = initializePalm(hand.type, config);
    scene.nativeSceneRef.add(scene.hands[hand.type].palm);
  }
  const position = updatePalmPosition(hand, scene);
  updatePalmAlign(hand, scene);
  updatePalmNormalVector(hand, position, scene);
  //updatePalmDirectionalVector(hand, scene);
}

export function renderFinger(
  type: string,
  pointable: LeapPointable,
  scene: MultiHandScene,
  config: HandConfig,
) {
  let fingers = scene.hands[type].fingers;
  if (!fingers[pointable.type]) {
    fingers[pointable.type] = initializeFinger(pointable, scene, config);
    scene.nativeSceneRef.add(fingers[pointable.type]);
  }
  updateFinger(pointable, fingers[pointable.type], scene);
}