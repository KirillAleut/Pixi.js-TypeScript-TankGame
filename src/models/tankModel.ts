import { IPoint } from "pixi.js";
import { MovableModel, Direction, DIRECTIONS_COUNT } from "./movableModel";
import { DEBUG, BLOCK_SIZE } from "../services/constants";

const TANK_WIDTH = BLOCK_SIZE; //px
const TANK_HEIGHT = BLOCK_SIZE; //px

export enum TankColor {
  Red,
  Green,
  Blue,
}
export const TANK_COLORS_COUNT = Object.keys(TankColor).length / 2;

export class TankModel extends MovableModel {
  wasMoved: boolean;
  private _color: TankColor;

  private _backwardAcceleration: number = 1.2;
  private _acceleration: number = 2;
  private _maxVelocity: number = 15;

  private _bulletsPerShot: number = 2;
  private _delayBetweenBullets: number = 200;
  private _shotRecoil: number = 10;

  constructor(position: IPoint, tankColor: TankColor) {
    super(position, Direction.Up);
    this.width = TANK_WIDTH;
    this.height = TANK_HEIGHT;
    this.wasMoved = false;
    this._color = tankColor;
    this._setTanksParameters(tankColor);
    if (DEBUG) console.dir(this);
  }

  get color(): TankColor {
    return this._color;
  }

  get bulletsPerShot(): number {
    return this._bulletsPerShot;
  }

  get delayBetweenBullets(): number {
    return this._delayBetweenBullets;
  }

  accelerate(forward: boolean = true) {
    this.velocity += forward ? this._acceleration : -this._backwardAcceleration;
    if (this.velocity > this._maxVelocity) this.velocity = this._maxVelocity;
    if (this.velocity < -this._maxVelocity) this.velocity = -this._maxVelocity;
  }

  rotate(clockwise: boolean = true) {
    this.velocity = 0;
    this.direction += clockwise ? 1 : -1;
    if (this.direction >= DIRECTIONS_COUNT) {
      this.direction = this.direction % DIRECTIONS_COUNT;
    }
    if (this.direction < 0) {
      this.direction = this.direction + DIRECTIONS_COUNT;
    }
    this._setAngle(this.direction);
  }

  switchColorToNext() {
    this.velocity = 0;
    this._color += 1;
    if (this._color >= TANK_COLORS_COUNT) {
      this._color = this._color % TANK_COLORS_COUNT;
    }
    this._setTanksParameters(this._color);
  }

  recoil() {
    this.velocity -= this._shotRecoil;
    if (this.velocity < -this._maxVelocity) this.velocity = -this._maxVelocity;
  }

  override move() {
    if (this.velocity !== 0) {
      this.wasMoved = true;
    } else this.wasMoved = false;
    super.move();
  }

  private _setAngle(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.angle = 0;
        break;
      case Direction.Right:
        this.angle = 90;
        break;
      case Direction.Down:
        this.angle = 180;
        break;
      case Direction.Left:
        this.angle = 270;
        break;
      default:
        throw new Error("Wrong Direction value");
    }
  }

  private _setTanksParameters(color: TankColor) {
    switch (color) {
      case TankColor.Red:
        this._maxVelocity = 15;
        this._acceleration = 2;
        this._backwardAcceleration = 1.2;
        this.friction = 1;
        this._bulletsPerShot = 2;
        this._delayBetweenBullets = 200; //ms
        this._shotRecoil = 10;
        break;
      case TankColor.Green:
        this._maxVelocity = 10;
        this._acceleration = 1.5;
        this._backwardAcceleration = 1.5;
        this.friction = 1;
        this._bulletsPerShot = 1;
        this._delayBetweenBullets = 2000; //ms
        this._shotRecoil = 15;
        break;
      case TankColor.Blue:
        this._maxVelocity = 5;
        this._acceleration = 1.2;
        this._backwardAcceleration = 1.1;
        this.friction = 1;
        this._bulletsPerShot = 3;
        this._delayBetweenBullets = 100; //ms
        this._shotRecoil = 20;
        break;
      default:
        throw new Error("Wrong TankColor value");
    }
  }
}
