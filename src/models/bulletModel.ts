import { IPoint } from "pixi.js";
import { MovableModel, Direction } from "./movableModel";
import { TankColor } from "./tankModel";
import { DEBUG, BLOCK_SIZE } from "../services/constants";

const BULLET_WIDTH = BLOCK_SIZE; //px
const BULLET_HEIGHT = BLOCK_SIZE; //px

export class BulletModel extends MovableModel {
  private _damage: number = 0;

  constructor(position: IPoint, direction: Direction, color: TankColor) {
    super(position, direction);
    this.width = BULLET_WIDTH;
    this.height = BULLET_HEIGHT;
    this._changeColor(color);
    if (DEBUG) console.dir(this);
  }

  get damage(): number {
    return this._damage;
  }

  private _changeColor(color: TankColor) {
    switch (color) {
      case TankColor.Red:
        this._damage = 10;
        this.velocity = 50;
        this.friction = 1.2;
        break;
      case TankColor.Green:
        this._damage = 25;
        this.velocity = 60;
        this.friction = 1.2;
        break;
      case TankColor.Blue:
        this._damage = 20;
        this.velocity = 40;
        this.friction = 1.2;
        break;
      default:
        throw new Error("Wrong TankColor value");
    }
  }
}
