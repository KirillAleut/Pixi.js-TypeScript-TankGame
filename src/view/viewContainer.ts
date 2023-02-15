import { Container, Sprite, BLEND_MODES } from "pixi.js";

export class ViewContainer extends Container {
  activeSprite: Sprite;
  sprites: Sprite[];

  constructor(sprites: Sprite[], activeSpriteIndex = 0) {
    super();
    this.sprites = sprites;
    this.sprites.forEach((sprt) => {
      sprt.blendMode = BLEND_MODES.ADD;
      sprt.visible = false;
      this.addChild(sprt);
    });
    this.activeSprite = this.sprites[activeSpriteIndex];
    this.activeSprite.visible = true;
  }

  switchActiveSprite(index: number) {
    this.activeSprite.visible = false;
    this.activeSprite = this.sprites[index];
  }
}
