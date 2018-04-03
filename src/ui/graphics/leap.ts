import * as THREE from 'three';

import { MultiHandScene, HandScene, HandConfig, Projection3 } from '@/ui/graphics/types';
import { LeapDeviceFrame, LeapHandTrackingData, LeapHand, LeapPointable, LeapInteractionBox } from 'devices/leapmotion';
import { project } from './util';
import { Geometry, TubeBufferGeometry, WireframeGeometry } from 'three';

export function makeLineVector(): THREE.Line {
    return new THREE.Line(new THREE.Geometry().setFromPoints(
        [
          new THREE.Vector3(0, 0, 0), 
          new THREE.Vector3(10, 10, 10)
        ]
    ), new THREE.LineBasicMaterial( { color: 0xff0000, } ))
}

export const DefaultHandConfig: HandConfig = {
    mainColor: 0x156289,
    emissiveColor: 0x072534,
    drawWireFrame: true,
    drawDirectionalVector: true,
    drawNormalVector: true
}

export function initializePalm(type: string, config: Partial<HandConfig>): HandScene {
    const mergedConfig = { ...DefaultHandConfig, config };
    const mesh = new THREE.Object3D();
    const geometry = 
        new THREE.CircleBufferGeometry(10, 32, 0, 2 * Math.PI);

    mesh.add(new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial( {
            color: mergedConfig.mainColor,
            emissive: mergedConfig.emissiveColor,
            side: THREE.DoubleSide,
            flatShading: true
        } )  
    ))

    if (mergedConfig.drawWireFrame) {
        mesh.add(new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5
            })
        ));
    }

    return {
        palm: mesh,
        fingers: {},
        palmNormalVector: undefined,
        palmDirectionalVector: undefined,
        config: mergedConfig
    } as HandScene
}

export function setProjection(iBox: LeapInteractionBox, scene: MultiHandScene) {
    const min = []
    const max = [];
    for (let i in [0, 1, 2]) {
        min.push(iBox.center[i] - iBox.size[i] / 2);
        max.push(iBox.center[i] + iBox.size[i] / 2);
    }
    scene.projectionFrom = { min, max };
    scene.projectionTo = { min: [0, 0, 0], max: [50, 50, 50] }
}

export function project3(vector3: number[], projection: {projectionFrom: Projection3, projectionTo: Projection3}): number[] {
    const projected = [];
    for (let i in [0, 1, 2]) {
        projected.push(project(vector3[i], 
            projection.projectionFrom.min[i], 
            projection.projectionFrom.max[i], 
            projection.projectionTo.min[i], 
            projection.projectionTo.max[i]));
    }
    return projected;
}

export function render(frame: LeapHandTrackingData, scene: MultiHandScene) {
    setProjection(frame.data.interactionBox, scene);
    frame.data.hands.forEach((hand) => {
        renderHand(hand, scene);

        frame.data.pointables
          .filter((pointable) => pointable.handId === hand.id)
          .forEach((pointable) => {
            renderFinger(hand.type, pointable, scene);
        });
    });
}

export function renderHand(hand: LeapHand, scene: MultiHandScene) {
    if (!scene.hands[hand.type]) {
        scene.hands[hand.type] = initializePalm(hand.type, {});
        scene.nativeSceneRef.add(scene.hands[hand.type].palm);
    }
    const position = updatePalmPosition(hand, scene);
    updatePalmAlign(hand, scene);
    updatePalmNormalVector(hand, position, scene);
    //updatePalmDirectionalVector(hand, scene);
}

function updatePalmPosition(hand: LeapHand, scene: MultiHandScene): number[] {
    const [x, y, z] = project3(hand.palmPosition, scene);
    scene.hands[hand.type].palm.position.set(x, y, z);
    return [x, y, z];
}

function updatePalmAlign(hand: LeapHand, scene: MultiHandScene) {
    const normal = new THREE.Vector3(...hand.palmNormal);
    scene.hands[hand.type].palm.children.forEach((mesh) => {
        mesh.lookAt(normal);
    })
}

function updatePalmNormalVector(hand: LeapHand, palmPosition: number[], scene: MultiHandScene) {
    const normal = scene.hands[hand.type].palmNormalVector;
    if (normal) {
       const geometry = normal.geometry as Geometry;
       geometry.vertices = [
           new THREE.Vector3(0, 0, 0),
           new THREE.Vector3(...hand.palmNormal.map(x => x * 50))
       ]
       geometry.verticesNeedUpdate = true;
       normal.position.set.apply(normal.position, ...palmPosition);
    }
}

export function renderFinger(type: string, pointable: LeapPointable, scene: MultiHandScene) {
    let fingers = scene.hands[type].fingers;
    if (!fingers[pointable.type]) {
        fingers[pointable.type] = initializeFinger(pointable, scene);
        scene.nativeSceneRef.add(fingers[pointable.type]);
    }
    updateFinger(pointable, fingers[pointable.type], scene);
}

export function initializeFinger(finger: LeapPointable, scene: MultiHandScene): THREE.Object3D {
    const fingerMesh = new THREE.Object3D();
    const fingerTubeGeometry = getFingerTubeGeometry(finger, scene);
    fingerMesh.add(new THREE.LineSegments(
        new THREE.WireframeGeometry(fingerTubeGeometry), 
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        })))
    fingerMesh.add(new THREE.Mesh(
        fingerTubeGeometry,
        new THREE.MeshPhongMaterial( { 
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        } )
    ));
    return fingerMesh;
}

export function updateFinger(pointable: LeapPointable, fingerMesh: THREE.Object3D, scene: MultiHandScene) {
    const fingerTube = getFingerTubeGeometry(pointable, scene);
    const oldTube = ((fingerMesh.children[0] as THREE.Mesh).geometry as THREE.TubeBufferGeometry);
    oldTube.copy(fingerTube);
    if (fingerMesh.children.length > 1) {
        const oldWireFrame = (fingerMesh.children[1] as THREE.LineSegments).geometry as WireframeGeometry
        oldWireFrame.copy(new WireframeGeometry(fingerTube));
    }
}

function getFingerTubeGeometry(p: LeapPointable, scene: MultiHandScene): THREE.TubeBufferGeometry {
    return new THREE.TubeBufferGeometry(
        new THREE.CatmullRomCurve3(
            [p.mcpPosition, p.pipPosition, p.dipPosition, p.tipPosition]
                .map(pos => new THREE.Vector3(...project3(pos, scene)))
        ), 20, 2, 8, false
    );
}

export function initializeScene(nativeSceneRef: THREE.Scene): MultiHandScene {
    return { nativeSceneRef, hands: {} } as MultiHandScene
}