import { AssetsService } from "../services/assetsService";
import { BlockView } from "./bloсkView";
import {
  WALL_ASSET_NAMES,
  EXPLOSION_ANIMATION_NAME,
} from "../services/constants";
export class WallBlock extends BlockView {
  constructor() {
    const sprites = [AssetsService.getSprite(WALL_ASSET_NAMES.UNDAMAGED)];
    const animation = AssetsService.getAnimatedSprite(EXPLOSION_ANIMATION_NAME);

    super(sprites, animation);
  }
}
