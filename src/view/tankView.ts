import { TankColor } from "../models/tankModel";
import { AssetsService } from "../services/assetsService";
import { viewContainerWithAnimation } from "./viewContainerWithAnimation";
import {
  TANK_COLOR_ASSET_NAMES,
  BLINK_ANIMATION_NAME,
} from "../services/constants";

export class TankView extends viewContainerWithAnimation {
  constructor(activeColor: TankColor) {
    const sprites = [
      AssetsService.getSprite(TANK_COLOR_ASSET_NAMES.RED),
      AssetsService.getSprite(TANK_COLOR_ASSET_NAMES.GREEN),
      AssetsService.getSprite(TANK_COLOR_ASSET_NAMES.BLUE),
    ];

    const animation = AssetsService.getAnimatedSprite(BLINK_ANIMATION_NAME);

    super(sprites, activeColor, animation);
    this.activeSprite.visible = false;
    this.animationSprite.visible = true;
    this.animationSprite.play();
  }

  switchColor(color: TankColor) {
    this.playAnimation();
    this.switchActiveSprite(color);
  }

  update() {}
}
