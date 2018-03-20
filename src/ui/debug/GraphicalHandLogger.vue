<template>
<section>
  <div id="bad-connection-warning" v-show="!connectionHealthy">No connection to the Device. Check the Status Tab!</div>
  <main class="three-container" ref="animation"></main>
</section>
</template>

<script lang="ts">
import Vue from 'vue';
import * as THREE from 'three';
import { Component } from 'vue-property-decorator';

import * as device from '@/state/modules/device'

@Component
export default class GraphicalHandLogger extends Vue {
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera | undefined;
    private renderer: THREE.Renderer | undefined;
    private animationHandle: number | undefined;
    
    private mounted() {
        this.initializeGraphics();
        this.addCube(this.scene);
        this.animate();
    }

    private beforeDestroy() {
        if (this.animationHandle) {
            window.cancelAnimationFrame(this.animationHandle);
        }
    }

    private addCube(scene: THREE.Scene) {
        scene.add(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        ))
        if (this.camera) this.camera.position.z = 5;
    }

    private drawBadConnectionWarning(scene: THREE.Scene) {
    }

    private drawPalm(scene: THREE.Scene) {

    }

    private initializeGraphics() {
        let animation = this.$refs.animation as HTMLMainElement
        this.camera = new THREE.PerspectiveCamera(75, animation.clientWidth / animation.clientHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(animation.clientWidth, animation.clientHeight);
        animation.appendChild(this.renderer.domElement);
    }

    private animate() {
        this.animationHandle = window.requestAnimationFrame(this.animate)
        if (this.renderer && this.camera) {
            if (!device.getConnectionHealthy(this.$store)) {
                this.drawBadConnectionWarning(this.scene);
            } else {
                this.drawPalm(this.scene);
            }
            this.renderer.render(this.scene, this.camera);
        } else {
            console.warn('THREE.js not initialized properly')
            window.cancelAnimationFrame(this.animationHandle);
        }
    }

  get connectionHealthy(): boolean | undefined {
    return device.getConnectionHealthy(this.$store);
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
