import { Sprite, AnimatedSprite, BLEND_MODES } from "pixi.js";
import { ViewContainer } from "./ViewContainer";

export enum SPRITE_NAMES {
  Red = "tank-red.png",
  Green = "tank-green.png",
  Blue = "tank-blue.png",
}

export class viewContainerWithAnimation extends ViewContainer {
  animationSprite: AnimatedSprite;
  animationSpeed: number = 0.15;

  constructor(
    sprites: Sprite[],
    activeSpriteIndex: number = 0,
    animationSprite: AnimatedSprite
  ) {
    super(sprites, activeSpriteIndex);

    this.animationSprite = animationSprite;
    this.animationSprite.blendMode = BLEND_MODES.ADD;
    this.addChild(this.animationSprite);
    this.animationSprite.loop = false;
    this.animationSprite.animationSpeed = this.animationSpeed;
    this.animationSprite.onComplete = () => {
      this.animationOnComplete();
    };
    this.animationSprite.visible = false;
  }

  playAnimation() {
    this.activeSprite.visible = false;
    this.animationSprite.visible = true;
    this.animationSprite.gotoAndPlay(0);
  }

  animationOnComplete() {
    this.animationSprite.visible = false;
    this.activeSprite.visible = true;
  }
}
