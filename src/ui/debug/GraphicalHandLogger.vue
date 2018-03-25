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

@Component
export default class GraphicalHandLogger extends Vue {
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera | undefined;
    private renderer: THREE.Renderer | undefined;
    private animationHandle: number | undefined;
    private controls: THREE.OrbitControls | undefined;

    private palmBox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(50, 50, 50), 
        new THREE.MeshBasicMaterial({ color: 'black' })) 
    
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
            if (hand) {
                this.palmBox.position.set(hand.palmPosition[0], hand.palmPosition[1], hand.palmPosition[2])
            }
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
        this.scene.add(this.palmBox);
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
