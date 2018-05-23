const p5 = require("p5/lib/p5.min") as any;

import { Game, GameConfiguration } from "@/games/types";
import { ClassificationData } from "@/classify";
import { GenericHandTrackingData } from "@/devices";

declare global {
  interface Window {
    p5: any;
  }
}

export default class SpaceShooterGame implements Game {
  public iP5: p5 | undefined;

  async onStart(config: GameConfiguration) {
    this.iP5 = new p5((s: p5) => {
      s.setup = () => {
        s.createCanvas(config.element.clientWidth, config.element.clientHeight);
      };

      s.draw = () => {
        s.background(0);
        s.fill(255);
        s.rect(100, 100, 50, 50);
      };
    }, config.element);
  }

  async onStop() {
    console.log("onStop");
  }

  async onPause() {
    console.log("onPause");
  }
  onClassificationReceived(c: ClassificationData) {}

  onMotionTrackingDataReceived(m: GenericHandTrackingData) {}
}
