import { Sprite, IPoint, BLEND_MODES, Texture } from "pixi.js";
import { TankColor } from "../models/tankModel";
import { Direction } from "../models/movableModel";
import { BulletModel } from "../models/bulletModel";

export class BulletController {
  private _view: Sprite;
  private _model: BulletModel;

  constructor(
    texture: Texture,
    position: IPoint,
    direction: Direction,
    color: TankColor
  ) {
    this._model = new BulletModel(position, direction, color);
    this._model.visible = false;
    this._view = new Sprite(texture);
    this._view.blendMode = BLEND_MODES.ADD;

    this._view.position = position;
    switch (direction) {
      case Direction.Up:
        this._view.angle = 0;
        this._model.angle = 0;
        break;
      case Direction.Right:
        this._view.angle = 90;
        this._model.angle = 90;
        break;
      case Direction.Down:
        this._view.angle = 180;
        this._model.angle = 180;
        break;
      case Direction.Left:
        this._view.angle = 270;
        this._model.angle = 270;
        break;
      default:
        throw new Error("Wrong Direction value");
    }
  }

  get model(): BulletModel {
    return Object.assign(this._model);
  }

  get velocity(): number {
    return this._model.velocity;
  }
  get view(): Sprite {
    return this._view;
  }

  update() {
    if (this._model.velocity !== 0) {
      this._model.move();
      this._applyMotion();
    } else this.destroy();
  }

  destroy() {
    this._model.velocity = 0;
    this._view.removeFromParent();
  }

  private _applyMotion() {
    this._view.position = this._model.position.clone();
  }
}
