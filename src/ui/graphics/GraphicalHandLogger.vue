<template>
<section>
  <div id="bad-connection-warning" v-show="!connectionHealthy">No connection to the Device. Check the Status Tab!</div>
  <main class="three-container" ref="animation"></main>
</section>
</template>

<script lang="ts">
import Vue from 'vue';
import * as THREE from 'three';
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls'
import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls'

import { Component, Prop } from 'vue-property-decorator';

import * as device from '@/state/modules/device'
import { DeviceFacade, GenericHandTrackingData } from 'devices';
import { LEAP_MOTION_DEVICE_NAME, LeapDeviceFrame } from 'devices/leapmotion';

import { project } from '@/ui/graphics/util';
import { InteractionBox } from 'leapjs';
import { BufferGeometry, Geometry } from 'three';

@Component
export default class GraphicalHandLogger extends Vue {
    @Prop({ default: false })
    public transparent!: boolean;

    @Prop({ default: 0x0 })
    public background!: number;

    @Prop({ default: true })
    public grid!: boolean;

    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera | undefined;
    private renderer: THREE.WebGLRenderer | undefined;
    private animationHandle: number | undefined;
    private controls: THREE.OrbitControls | undefined;

    private palmBox: {[type: string]: {mesh: THREE.Object3D, fingers: {[type: number]: THREE.Object3D}}} = {};
//@ts-ignore
    private palmNormalVector = new THREE.Line(new THREE.Geometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 10, 10)
    ]), new THREE.LineBasicMaterial( { color: 0xff0000, } ))

    private mounted() {
        this.initializeGraphics();
        this.setupDataStream();
        this.animate();
    }

    private beforeDestroy() {
        if (this.animationHandle) {
            window.cancelAnimationFrame(this.animationHandle);
        }
    }

    private setupDataStream() {
        const data = device.getDeviceFacade(this.$store).getHandTrackingData();
        if (data) {
            data.subscribe((frame) => {
                this.drawPalm(frame);
            });
        }
    }

    private drawPalm(frame: GenericHandTrackingData) {
        const deviceName = device.getDeviceFacade(this.$store).getDeviceDriver().deviceName;
        if (deviceName == LEAP_MOTION_DEVICE_NAME) {
            const leapFrame = frame.data as LeapDeviceFrame
            const hand = leapFrame.hands[0];
            leapFrame.hands.forEach((hand) => {
                if (!this.palmBox[hand.type]) {
           			var mesh = new THREE.Object3D();
                    const geometry = 
                        new THREE.CircleBufferGeometry(10, 32, 0, 2 * Math.PI);
                    mesh.add( new THREE.LineSegments(
                            //@ts-ignore
                            new THREE.WireframeGeometry(geometry),
                            new THREE.LineBasicMaterial( {
                                color: 0xffffff,
                                transparent: true,
                                opacity: 0.5
                                } )
                    ));
                    mesh.add(new THREE.Mesh(
                        //@ts-ignore
                        geometry,
                        new THREE.MeshPhongMaterial( {
                            color: 0x156289,
                            emissive: 0x072534,
                            side: THREE.DoubleSide,
                            flatShading: true
                        } )  
                    ))
                    this.palmBox[hand.type] = { mesh: mesh,
                        fingers: {}
                    }
                    this.scene.add(this.palmBox[hand.type].mesh);
                }
                if (hand) {
                    const x = project(hand.palmPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50);
                    const y = project(hand.palmPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50);
                    const z = project(hand.palmPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50);
                    this.palmBox[hand.type].mesh.position.set(x, y, z)
                    const dir = new THREE.Vector3(hand.palmNormal[0], hand.palmNormal[1], hand.palmNormal[2]);

                    const palmObj = this.palmBox[hand.type].mesh.children[1] as THREE.Mesh
                    palmObj.lookAt(dir)

                    const meshObj = this.palmBox[hand.type].mesh.children[0] as THREE.Mesh
                    meshObj.lookAt(dir)

                    const norm = this.palmNormalVector.geometry as Geometry
                    norm.vertices = []
                    norm.vertices.push(new THREE.Vector3(0, 0, 0));
                    norm.vertices.push(new THREE.Vector3(hand.palmNormal[0]*50, hand.palmNormal[1]*50, hand.palmNormal[2]*50));
                    this.palmNormalVector.position.set(x, y, z);
                    norm.verticesNeedUpdate = true;

                    leapFrame.pointables.filter((p) => p.handId == hand.id).forEach((pointable) => {
                        if (!this.palmBox[hand.type].fingers[pointable.type]) {
                            const fingerMesh = new THREE.Object3D();
                            const fingerTubeGeometry = new THREE.TubeBufferGeometry(
                                new THREE.CatmullRomCurve3([
                                    new THREE.Vector3(
                                        project(pointable.mcpPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                        project(pointable.mcpPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                        project(pointable.mcpPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                    ),
                                    new THREE.Vector3(
                                        project(pointable.pipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                        project(pointable.pipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                        project(pointable.pipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                    ),
                                    new THREE.Vector3(
                                        project(pointable.dipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                        project(pointable.dipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                        project(pointable.dipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                    ),
                                    new THREE.Vector3(
                                        project(pointable.tipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                        project(pointable.tipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                        project(pointable.tipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                    )
                                ]), 20, 2, 8, false);
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
                            
                            this.palmBox[hand.type].fingers[pointable.type] = fingerMesh; 
                            this.scene.add(this.palmBox[hand.type].fingers[pointable.type]);
                        }
                        const fingerTubeGeometry = new THREE.TubeBufferGeometry(
                            new THREE.CatmullRomCurve3([
                                new THREE.Vector3(
                                    project(pointable.mcpPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                    project(pointable.mcpPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                    project(pointable.mcpPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                ),
                                new THREE.Vector3(
                                    project(pointable.pipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                    project(pointable.pipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                    project(pointable.pipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                ),
                                new THREE.Vector3(
                                    project(pointable.dipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                    project(pointable.dipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                    project(pointable.dipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                ),
                                new THREE.Vector3(
                                    project(pointable.tipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                    project(pointable.tipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                    project(pointable.tipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                                )
                            ]), 20, 2, 8, false);
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].children[1].geometry.copy(fingerTubeGeometry);
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].children[0].geometry.copy(new THREE.WireframeGeometry(fingerTubeGeometry));
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].children[0].geometry.verticesNeedUpdate = true;
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].children[1].geometry.verticesNeedUpdate = true;
                    });
                }
            })
        } else {
            console.warn('Can\'t plot hand tracking data from unsupported device:', deviceName);
        }
    }

    private initializeGraphics() {
        let animation = this.$refs.animation as HTMLMainElement
        this.camera = new THREE.PerspectiveCamera(75, animation.clientWidth / animation.clientHeight, 0.1, 1000)

        this.controls = new THREE.OrbitControls(this.camera, animation);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
		this.controls.minDistance = 100;
		this.controls.maxDistance = 500

        var lights = [];
		lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		lights[ 0 ].position.set( 0, 200, 0 );
		lights[ 1 ].position.set( 100, 200, 100 );
		lights[ 2 ].position.set( - 100, - 200, - 100 );
        this.scene.add(lights[0], lights[1], lights[2]);
        this.scene.add(this.palmNormalVector)

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: this.transparent });
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(animation.clientWidth, animation.clientHeight);
        animation.appendChild(this.renderer.domElement);

        if (this.transparent) {
            this.scene.background = new THREE.Color(0xffffff); 
        } else {
            this.scene.background = new THREE.Color(this.background); 
        }

        if (this.grid) {
            let axisHelper = new THREE.GridHelper(100, 10);
            this.scene.add(axisHelper);
        }
    }

    private animate() {
        this.animationHandle = window.requestAnimationFrame(this.animate)
        if (this.renderer && this.camera) {
            if (!device.getConnectionHealthy(this.$store)) {
            } else {
                if (this.controls) {this.controls.update()}
                this.renderer.render(this.scene, this.camera);
            }
        } else {
            console.warn('THREE.js not initialized properly')
            window.cancelAnimationFrame(this.animationHandle);
        }
    }

  get connectionHealthy(): boolean | undefined {
    return device.getConnectionHealthy(this.$store);
  }

  get deviceFacade(): DeviceFacade {
      return device.getDeviceFacade(this.$store);
  }
}
</script>

<style lang="scss" scoped>
#bad-connection-warning {
    position: absolute;
    margin: 20px;
    font-family: monospace;
    color: white;
    background-color: black;
}

main {
    width: 100%;
    height: 100%;
}

section {
    width: 100%;
    height: 100%;
}

</style>
