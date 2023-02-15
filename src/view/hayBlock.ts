import { AssetsService } from "../services/assetsService";
import { BlockView } from "./bloсkView";
import {
  HAY_ASSET_NAMES,
  EXPLOSION_ANIMATION_NAME,
} from "../services/constants";

const MAX_HITPOINTS = 100;
const DAMAGED_HITPOINTS = 60;
const DAMAGED_HITPOINTS_2 = 30;

export class HayBlock extends BlockView {
  constructor() {
    const sprites = [
      AssetsService.getSprite(HAY_ASSET_NAMES.UNDAMAGED),
      AssetsService.getSprite(HAY_ASSET_NAMES.DAMAGED),
      AssetsService.getSprite(HAY_ASSET_NAMES.DAMAGED_2),
    ];
    const animation = AssetsService.getAnimatedSprite(EXPLOSION_ANIMATION_NAME);

    super(sprites, animation);
    this.hitpoints = MAX_HITPOINTS;
  }

  dealDamage(damage: number) {
    this.hitpoints -= damage;
    if (this.hitpoints < DAMAGED_HITPOINTS) {
      if (this.hitpoints > DAMAGED_HITPOINTS_2) {
        this.switchActiveSprite(1);
      } else {
        this.switchActiveSprite(2);
      }
    } else {
      this.switchActiveSprite(0);
    }
  }
}
