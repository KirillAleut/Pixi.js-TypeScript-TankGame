import { Container } from "pixi.js";
import { BLOCK_SIZE } from "../../services/constants";

// it will get randomly positioned sprites from WorldModel
export class WorldView extends Container {
  constructor() {
    super();
    this.x = BLOCK_SIZE / 2;
    this.y = BLOCK_SIZE / 2;
  }
}
