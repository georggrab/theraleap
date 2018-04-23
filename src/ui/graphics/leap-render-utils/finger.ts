import { WireframeGeometry } from 'three';
import * as THREE from 'three';

import { LeapPointable } from "@/devices/leapmotion";
import { MultiHandScene, HandConfig } from '@/ui/graphics/types';
import { project3 } from '@/ui/graphics/util';

/**
 * Create a new Finger Object and add it to the internal scene state
 * @param finger Leap Pointable data on which basis the Finger Mesh shall be created
 * @param scene The internal scene state
 */
export function initializeFinger(
  finger: LeapPointable,
  scene: MultiHandScene,
  config: HandConfig
): THREE.Object3D {
  const fingerMesh = new THREE.Object3D();
  const fingerTubeGeometry = getFingerTubeGeometry(finger, scene);
  fingerMesh.add(
    new THREE.Mesh(
      fingerTubeGeometry,
      new THREE.MeshPhongMaterial({
        color: config.mainColor,
        emissive: config.emissiveColor,
        side: THREE.DoubleSide,
        flatShading: true
      })
    )
  );
  fingerMesh.add(
    new THREE.LineSegments(
      new THREE.WireframeGeometry(fingerTubeGeometry),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      })
    )
  );
  return fingerMesh;
}

/**
 * Update the Finger painted on screen.
 * @param pointable New Data
 * @param fingerMesh Existing Finger Mesh
 * @param scene Scene State
 */
export function updateFinger(
  pointable: LeapPointable,
  fingerMesh: THREE.Object3D,
  scene: MultiHandScene
) {
  const fingerTube = getFingerTubeGeometry(pointable, scene);
  const oldTube = (fingerMesh.children[0] as THREE.Mesh)
    .geometry as THREE.TubeBufferGeometry;
  oldTube.copy(fingerTube);
  if (fingerMesh.children.length > 1) {
    const oldWireFrame = (fingerMesh.children[1] as THREE.LineSegments)
      .geometry as WireframeGeometry;
    oldWireFrame.copy(new WireframeGeometry(fingerTube));
  }
}

/**
 * Convert a Leap Pointable as coming from the device into a BufferTubeGeometry,
 * optionally smoothed by a CatmullRomCurve.
 * @param p The Leap Pointable
 * @param scene The Scene State
 */
export function getFingerTubeGeometry(
  p: LeapPointable,
  scene: MultiHandScene
): THREE.TubeBufferGeometry {
  return new THREE.TubeBufferGeometry(
    new THREE.CatmullRomCurve3(
      [p.mcpPosition, p.pipPosition, p.dipPosition, p.tipPosition].map(
        pos => new THREE.Vector3(...project3(pos, scene))
      )
    ),
    20,
    2,
    8,
    false
  );
}