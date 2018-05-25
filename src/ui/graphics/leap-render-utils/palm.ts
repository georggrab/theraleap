import * as THREE from "three";
import { Geometry } from "three";

import { LeapHand } from "@/devices/leapmotion";
import { HandConfig, HandScene, MultiHandScene } from "@/ui/graphics/types";
import { project3 } from "@/ui/graphics/util";

export function initializePalm(
  type: string,
  config: Partial<HandConfig>
): HandScene {
  const mesh = new THREE.Object3D();
  const geometry = new THREE.CircleBufferGeometry(10, 32, 0, 2 * Math.PI);

  mesh.add(
    new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: config.mainColor,
        emissive: config.emissiveColor,
        side: THREE.DoubleSide,
        flatShading: true
      })
    )
  );

  if (config.drawWireFrame) {
    mesh.add(
      new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5
        })
      )
    );
  }

  return {
    palm: mesh,
    fingers: {},
    palmNormalVector: undefined,
    palmDirectionalVector: undefined,
    config
  } as HandScene;
}

export function updatePalmPosition(
  hand: LeapHand,
  scene: MultiHandScene
): number[] {
  const [x, y, z] = project3(hand.palmPosition, scene);
  scene.hands[hand.type].palm.position.set(x, y, z);
  return [x, y, z];
}

export function updatePalmAlign(hand: LeapHand, scene: MultiHandScene) {
  const normal = new THREE.Vector3(...hand.palmNormal);
  scene.hands[hand.type].palm.children.forEach(mesh => {
    mesh.lookAt(normal);
  });
}

export function updatePalmNormalVector(
  hand: LeapHand,
  palmPosition: number[],
  scene: MultiHandScene
) {
  const normal = scene.hands[hand.type].palmNormalVector;
  if (normal) {
    const geometry = normal.geometry as Geometry;
    geometry.vertices = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...hand.palmNormal.map(x => x * 50))
    ];
    geometry.verticesNeedUpdate = true;
    normal.position.set.apply(normal.position, ...palmPosition);
  }
}
