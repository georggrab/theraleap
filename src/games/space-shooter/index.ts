const p5 = require("p5/lib/p5.min") as any;

import { Game, GameConfiguration } from "@/games/types";
import { ClassificationData } from "@/classify";
import { GenericHandTrackingData } from "@/devices";
import { LeapDeviceFrame } from "@/devices/leapmotion";
import { project } from "@/ui/graphics/util";

import { Bullet, SpaceRock } from "./types";
import { shootBullet, tickBullets, tickSpaceRocks } from "./logic";
import { drawBullets, drawSpaceShip, drawScene, drawSpaceRocks } from "./draw";

export default class SpaceShooterGame implements Game {
  public iP5: p5 | undefined;

  private width!: number;
  private height!: number;

  private x: number = 100;
  private y: number = 100;

  private bullets: Bullet[] = [];
  private spaceRocks: SpaceRock[] = [];

  async onStart(config: GameConfiguration) {
    this.width = config.element.clientWidth;
    this.height = config.element.clientHeight;
    this.iP5 = new p5((s: p5) => {
      s.setup = () => {
        console.log(config.element.clientWidth);
        s.createCanvas(config.element.clientWidth, config.element.clientHeight);
      };

      s.draw = () => {
        drawScene(s);
        drawSpaceShip(this.x, this.y, s);
        this.bullets = tickBullets(this.bullets, s);
        this.spaceRocks = tickSpaceRocks(this.spaceRocks, s);
        drawSpaceRocks(this.spaceRocks, s);
        drawBullets(this.bullets, s);
      };
    }, config.element);
  }

  async onStop() {
    console.log("onStop");
  }

  async onPause() {
    console.log("onPause");
  }

  onClassificationReceived(c: ClassificationData) {
    shootBullet(this.bullets, this.x, this.y, 5);
  }

  onMotionTrackingDataReceived(m: GenericHandTrackingData) {
    const leap = m.data as LeapDeviceFrame;
    const iBox = leap.interactionBox;
    if (leap.hands && leap.hands.length >= 1) {
      this.x = project(
        leap.hands[0].palmPosition[0],
        iBox.center[0] - iBox.size[0] / 2,
        iBox.center[0] + iBox.size[0] / 2,
        0,
        this.width
      );
      this.y = project(
        leap.hands[0].palmPosition[2],
        iBox.center[2] - iBox.size[2] / 2,
        iBox.center[2] + iBox.size[2] / 2,
        this.height - this.height / 4,
        this.height - 100
      );
    }
  }
}
