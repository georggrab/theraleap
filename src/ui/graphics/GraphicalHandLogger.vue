<template>
<section>
  <div id="bad-connection-warning" v-show="!connectionHealthy">No connection to the Device. Check the Status Tab!</div>
  <main class="three-container" ref="animation"></main>
</section>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
import { BufferGeometry, Geometry } from "three";
import "imports-loader?THREE=three!three/examples/js/controls/OrbitControls";
import "imports-loader?THREE=three!three/examples/js/controls/TrackballControls";

import { Component, Prop } from "vue-property-decorator";

import * as device from "@/state/modules/device";
import { DeviceFacade, GenericHandTrackingData } from "devices";
import { LEAP_MOTION_DEVICE_NAME, LeapDeviceFrame } from "devices/leapmotion";

import * as graphics from "state/modules/graphics";

import { MultiHandScene } from "./types";
import * as leapRenderUtils from "./leap";
import { Observable } from "@reactivex/rxjs/dist/package/Observable";
import { Subscription } from "@reactivex/rxjs/dist/package/Subscription";

@Component
export default class GraphicalHandLogger extends Vue {
  @Prop({ default: false })
  public transparent!: boolean;

  @Prop({ default: 0x0 })
  public background!: number;

  @Prop({ default: true })
  public grid!: boolean;

  @Prop() public source!: Observable<GenericHandTrackingData>;

  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera | undefined;
  private animationHandle: number | undefined;
  private controls: THREE.OrbitControls | undefined;

  private multiHandScene: MultiHandScene | undefined;
  private subscription: Subscription | undefined;

  private mounted() {
    this.initializeGraphics();
    this.setupWindowResizeListener();
    this.setupDataStream();
    this.animate();
  }

  private setupWindowResizeListener() {
    window.addEventListener("resize", this.fixAspectRatioOnResize, false);
  }

  private removeWindowResizeListener() {
    window.removeEventListener("resize", this.fixAspectRatioOnResize);
  }

  private fixAspectRatioOnResize() {
    const animation = this.$refs.animation as HTMLMainElement;
    if (this.camera && animation) {
      this.camera.aspect = animation.clientWidth / animation.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(animation.clientWidth, animation.clientHeight);
    }
  }

  private beforeDestroy() {
    if (this.animationHandle) {
      window.cancelAnimationFrame(this.animationHandle);
    }
    this.removeWindowResizeListener();
    this.subscription!.unsubscribe();
  }

  private setupDataStream() {
    const name = this.deviceFacade.getDeviceDriver().deviceName;
    if (name == LEAP_MOTION_DEVICE_NAME) {
      if (!this.multiHandScene) {
        this.multiHandScene = leapRenderUtils.initializeScene(this.scene);
      }
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.source.subscribe(frame => {
        leapRenderUtils.render(frame, this.multiHandScene!);
      });
    } else {
      console.warn(
        "Can't plot hand tracking data from unsupported device:",
        name
      );
    }
  }

  private initializeGraphics() {
    let animation = this.$refs.animation as HTMLMainElement;

    this.camera = new THREE.PerspectiveCamera(
      75,
      animation.clientWidth / animation.clientHeight,
      0.1,
      1000
    );

    this.controls = new THREE.OrbitControls(this.camera, animation);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 500;

    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    this.scene.add(lights[0], lights[1], lights[2]);

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
    this.animationHandle = window.requestAnimationFrame(this.animate);
    if (this.renderer && this.camera) {
      if (!device.getConnectionHealthy(this.$store)) {
      } else {
        if (this.controls) {
          this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
      }
    } else {
      console.warn("THREE.js not initialized properly");
      window.cancelAnimationFrame(this.animationHandle);
    }
  }

  get renderer(): THREE.WebGLRenderer {
    return graphics.getRenderer(this.$store);
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
