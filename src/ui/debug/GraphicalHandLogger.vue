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

import { Component } from 'vue-property-decorator';

import * as device from '@/state/modules/device'
import { DeviceFacade, GenericHandTrackingData } from 'devices';
import { LEAP_MOTION_DEVICE_NAME, LeapDeviceFrame } from 'devices/leapmotion';

import { project } from '@/ui/graphics/util';
import { InteractionBox } from 'leapjs';

@Component
export default class GraphicalHandLogger extends Vue {
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera | undefined;
    private renderer: THREE.Renderer | undefined;
    private animationHandle: number | undefined;
    private controls: THREE.OrbitControls | undefined;

    private palmBox: {[type: string]: {mesh: THREE.Mesh, fingers: {[type: number]: THREE.Line}}} = {};

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
                    this.palmBox[hand.type] = { mesh: new THREE.Mesh(
                        new THREE.SphereBufferGeometry(2),
                        new THREE.MeshBasicMaterial({ color: 'black' })),
                        fingers: {}
                    }
                    this.scene.add(this.palmBox[hand.type].mesh);
                }
                if (hand) {
                    const x = project(hand.palmPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50);
                    const y = project(hand.palmPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50);
                    const z = project(hand.palmPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50);
                    this.palmBox[hand.type].mesh.position.set(x, y, z)

                    leapFrame.pointables.filter((p) => p.handId == hand.id).forEach((pointable) => {
                        if (!this.palmBox[hand.type].fingers[pointable.type]) {
                            this.palmBox[hand.type].fingers[pointable.type] = new THREE.Line(
                                new THREE.Geometry(),
                                new THREE.LineBasicMaterial({ color: 0x0000ff })
                            );
                            this.scene.add(this.palmBox[hand.type].fingers[pointable.type]);
                        }
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].geometry.vertices = [
                            new THREE.Vector3(
                                project(pointable.mcpPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                project(pointable.mcpPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                project(pointable.mcpPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                            ),
                            new THREE.Vector3(
                                project(pointable.pipPosition[0], leapFrame.interactionBox.center[0] - leapFrame.interactionBox.size[0] / 2, leapFrame.interactionBox.center[0] + leapFrame.interactionBox.size[0] / 2, 0, 50),
                                project(pointable.pipPosition[1], leapFrame.interactionBox.center[1] - leapFrame.interactionBox.size[1] / 2, leapFrame.interactionBox.center[1] + leapFrame.interactionBox.size[1] / 2, 0, 50),
                                project(pointable.pipPosition[2], leapFrame.interactionBox.center[2] - leapFrame.interactionBox.size[2] / 2, leapFrame.interactionBox.center[2] + leapFrame.interactionBox.size[2] / 2, 0, 50),
                            )
                        ]
                        //@ts-ignore
                        this.palmBox[hand.type].fingers[pointable.type].geometry.verticesNeedUpdate = true;

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


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(animation.clientWidth, animation.clientHeight);
        animation.appendChild(this.renderer.domElement);

        this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        this.scene.background = new THREE.Color( 0xcccccc );

        let axisHelper = new THREE.AxesHelper(100);
        this.scene.add(axisHelper);
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
.three-container {
    margin-top: 15px;
    height: 50vh;
}

#bad-connection-warning {
    position: absolute;
    margin: 20px;
    font-family: monospace;
}

</style>
