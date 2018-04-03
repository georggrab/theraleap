import * as THREE from 'three';

import { MultiHandScene, HandScene, HandConfig } from '@/ui/graphics/types';

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

export function initializeScene(): MultiHandScene {
    return { } as MultiHandScene
}