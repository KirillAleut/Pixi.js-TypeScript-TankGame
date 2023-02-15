import { Sprite, Point, IPoint, Texture } from "pixi.js";
export enum Direction {
  Up,
  Right,
  Down,
  Left,
}
export const DIRECTIONS_COUNT = Object.keys(Direction).length / 2;

export class MovableModel extends Sprite {
  private _prevPosition: Point = new Point();
  direction: Direction;
  velocity: number = 0;
  friction: number = 1;

  constructor(position: IPoint, direction: Direction) {
    super(Texture.WHITE);
    this.anchor.set(0.5, 0.5);
    position.copyTo(this.position);
    position.copyTo(this._prevPosition);
    this.direction = direction;
  }

  get prevPosition(): Point {
    return this._prevPosition.clone();
  }

  move() {
    if (Math.abs(this.velocity) < this.friction) this.velocity = 0;
    if (this.velocity !== 0) {
      this._prevPosition = this.position.clone();
      this.velocity += this.friction * (this.velocity > 0 ? -1 : 1);
      switch (this.direction) {
        case Direction.Up:
          this.position.y -= this.velocity;
          break;
        case Direction.Right:
          this.position.x += this.velocity;
          break;
        case Direction.Down:
          this.position.y += this.velocity;
          break;
        case Direction.Left:
          this.position.x -= this.velocity;
          break;
        default:
          throw new Error("Wrong Direction value");
      }
    }
  }
}
