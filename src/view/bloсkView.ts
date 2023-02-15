import { Sprite, AnimatedSprite, Point } from "pixi.js";
import { viewContainerWithAnimation } from "./viewContainerWithAnimation";

export class BlockView extends viewContainerWithAnimation {
  positionInWorldArray: Point;
  hitpoints = 1024;
  constructor(sprites: Sprite[], animation: AnimatedSprite) {
    super(sprites, 0, animation);
    this.positionInWorldArray = new Point();
  }
}
