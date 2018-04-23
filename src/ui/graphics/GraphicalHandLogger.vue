<template>
<section>
  <main class="three-container" ref="animation"></main>
</section>
</template>

<script lang="ts">
import Vue from "vue";
import "imports-loader?THREE=three!three/examples/js/controls/OrbitControls"
import * as THREE from "three";
import { BufferGeometry, Geometry } from "three";
import { Observable, Subscription } from "rxjs";

import { Component, Prop } from "vue-property-decorator";

import * as device from "@/state/modules/device";
import * as record from "@/state/modules/record";
import { DeviceFacade, GenericHandTrackingData } from "devices";
import { LEAP_MOTION_DEVICE_NAME, LeapDeviceFrame } from "devices/leapmotion";

import * as graphics from "@/state/modules/graphics";
import { hasSalvagableStream } from "@/state/utils";

import { MultiHandScene, HandConfig } from "./types";
import * as leapRenderUtils from "./leap-render-utils";

@Component
export default class GraphicalHandLogger extends Vue {
  @Prop({ default: false })
  public transparent!: boolean;

  @Prop({ default: 0x0 })
  public background!: number;

  @Prop({ default: true })
  public grid!: boolean;

  @Prop({ default: false })
  public rotate!: boolean;

  @Prop({ default: () => [0, 0, 0] })
  public cameraPosition!: number[];

  @Prop({ default: () => {} })
  public handConfig!: Partial<HandConfig>;

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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        leapRenderUtils.render(frame, this.multiHandScene!, this.handConfig);
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

    this.camera.position.set.apply(this.camera.position, this.cameraPosition);

    this.controls = new THREE.OrbitControls(this.camera, animation);
    this.controls.autoRotateSpeed = 0.5;
    this.controls.autoRotate = this.rotate;
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
        if (this.controls) {
          this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    } else {
      console.warn("THREE.js not initialized properly");
      window.cancelAnimationFrame(this.animationHandle);
    }
  }

  get renderer(): THREE.WebGLRenderer {
    return graphics.getRenderer(this.$store);
  }

  get deviceFacade(): DeviceFacade {
    return device.getDeviceFacade(this.$store);
  }
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
}

section {
  width: 100%;
  height: 100%;
}
</style>
