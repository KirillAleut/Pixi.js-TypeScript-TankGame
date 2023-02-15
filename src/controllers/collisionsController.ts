import { Sprite, Container, Rectangle, IPoint } from "pixi.js";
import { BlockView } from "../view/bloсkView";
import { BulletModel } from "../models/bulletModel";
import { MovableModel } from "../models/movableModel";
import { Direction } from "../models/movableModel";
import { WorldModel } from "../models/worldModel";
import {
  DEBUG,
  BLOCK_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from "../services/constants";

export class CollisionsController {
  private _worldModel: WorldModel;

  constructor(worldModel: WorldModel) {
    this._worldModel = worldModel;
  }

  // searches for collisions and put Tank to a position just before collision
  processTanksCollisions(tank: MovableModel): void {
    if (DEBUG) console.groupCollapsed(`processTanksCollisions`);
    this._processTanksCollisionsWithMapBounds(tank);

    const collidedBlock = this._searchModelsCollisionsWithBlocks(tank);
    if (collidedBlock) {
      if (DEBUG) console.log(collidedBlock);
      if (DEBUG)
        console.log(
          "%c" + "COLLISION WITH BLOCK!",
          "color: #FF0000; font-weight: bold;"
        );
      this._placeModelToLastPositionBeforeCollision(tank, collidedBlock);
    }
    if (DEBUG) console.groupEnd();
  }

  // searches for collisions, trigger collided block's interection
  processBulletsCollisions(bullet: BulletModel): boolean {
    if (DEBUG) console.groupCollapsed("processBulletsCollisions");
    const collidedBlock = this._searchModelsCollisionsWithBlocks(bullet);
    if (collidedBlock) {
      this._processBlockCollidedWithBullet(collidedBlock, bullet.damage);
      if (DEBUG)
        console.log(
          "%c" + "COLLISION WITH BLOCK!",
          "color: #FF0000; font-weight: bold;"
        );
      if (DEBUG) console.log(collidedBlock);
      if (DEBUG) console.groupEnd();

      return true;
    } else if (this._checkBulletsCollisionsWithMapBounds(bullet)) {
      if (DEBUG)
        console.log(
          "%c" + "COLLISION WITH MAP BOUNDS!",
          "color: #FF0000; font-weight: bold;"
        );
      if (DEBUG) console.groupEnd();
      return true;
    }
    if (DEBUG) console.groupEnd();
    return false;
  }

  private _checkBulletsCollisionsWithMapBounds(bullet: BulletModel): boolean {
    const x = bullet.position.x;
    const y = bullet.position.y;
    // world bounds + 1 BLOCK (to destroy bullets after living world map)
    return (
      x < -BLOCK_SIZE ||
      x > WORLD_WIDTH * BLOCK_SIZE ||
      y < -BLOCK_SIZE ||
      y > WORLD_HEIGHT * BLOCK_SIZE
    );
  }

  private _searchModelsCollisionsWithBlocks(
    model: MovableModel
  ): false | BlockView {
    let firstCollidedBlock: false | BlockView = false;
    const sortedblocks = this._getPotentialCollisisionBlocks(model);
    sortedblocks.every((block) => {
      //do untill we find the collision or array ends
      if (block) {
        firstCollidedBlock = this._modelBlockIntersect(model, block);
        if (firstCollidedBlock) {
          //this.processBlockCollidedWithBullet(collidedBlock, model.damage);
          return false; //break from every
        }
      }
      return true; //continue every
    });
    return firstCollidedBlock;
  }

  private _getPotentialCollisisionBlocks(
    model: MovableModel
  ): (false | BlockView)[] {
    const [selectionStartX, selectionStartY, selectionEndX, selectionEndY] =
      this._getPotentialCollisionsArea(model.position, model.prevPosition);
    const selection = this._worldModel.spriteMap
      .slice(selectionStartX, selectionEndX + 1)
      .map((i) => i.slice(selectionStartY, selectionEndY + 1));
    if (DEBUG) console.log("_map area = ", selection);
    if (selection.length > 0) {
      const [closestX, closestY] = this._getClosestBlockIndexes(model.position);
      const sortedblocks = selection
        .reduce((prev, curr) => prev.concat(curr)) // combine to one flat array
        .filter((a) => a) // delete false values
        .sort((a, b) => {
          let sort = 0;
          // sorts the blocks in order in the direction of movement
          // if order in this direction is the same, choose the closest one
          if (a === false || b === false) return 0; //cannot happen because of filter
          switch (model.direction) {
            case Direction.Up:
              sort = -a.positionInWorldArray.y + b.positionInWorldArray.y;
              if (sort !== 0) {
                return sort;
              } else
                return (
                  Math.abs(closestX - a.positionInWorldArray.x) -
                  Math.abs(closestX - b.positionInWorldArray.x)
                );
            case Direction.Right:
              sort = a.positionInWorldArray.x - b.positionInWorldArray.x;
              if (sort !== 0) {
                return sort;
              } else
                return (
                  Math.abs(closestY - a.positionInWorldArray.y) -
                  Math.abs(closestY - b.positionInWorldArray.y)
                );
            case Direction.Down:
              sort = a.positionInWorldArray.y - b.positionInWorldArray.y;
              if (sort !== 0) {
                return sort;
              } else
                return (
                  Math.abs(closestX - a.positionInWorldArray.x) -
                  Math.abs(closestX - b.positionInWorldArray.x)
                );
            case Direction.Left:
              sort = -a.positionInWorldArray.x + b.positionInWorldArray.x;
              if (sort !== 0) {
                return sort;
              } else
                return (
                  Math.abs(closestY - a.positionInWorldArray.y) -
                  Math.abs(closestY - b.positionInWorldArray.y)
                );
            default:
              throw new Error("Wrong Direction value");
          }
        });
      if (DEBUG) console.log("_getPotentialCollisisionBlocks = ", sortedblocks);
      return sortedblocks;
    } else return [];
  }

  private _processBlockCollidedWithBullet(block: BlockView, damage: number) {
    this._worldModel.damageBlock(
      block.positionInWorldArray.x,
      block.positionInWorldArray.y,
      damage
    );
  }

  private _processTanksCollisionsWithMapBounds(tank: MovableModel): void {
    if (tank.position.x < 0) tank.position.x = 0;
    if (tank.position.x > (WORLD_WIDTH - 1) * BLOCK_SIZE)
      tank.position.x = (WORLD_WIDTH - 1) * BLOCK_SIZE;
    if (tank.position.y < 0) tank.position.y = 0;
    if (tank.position.y > (WORLD_HEIGHT - 1) * BLOCK_SIZE)
      tank.position.y = (WORLD_HEIGHT - 1) * BLOCK_SIZE;
  }

  private _modelBlockIntersect(
    m: MovableModel,
    b: BlockView | false
  ): BlockView | false {
    if (!b) return false;

    const x = Math.min(m.x, m.prevPosition.x);
    const y = Math.min(m.y, m.prevPosition.y);
    const width = m.width + Math.abs(m.x - m.prevPosition.x);
    const height = m.width + Math.abs(m.y - m.prevPosition.y);
    const a = new Rectangle(x, y, width, height);

    if (DEBUG)
      console.debug(
        `a.x ${a.x} + a.width ${a.width} > b.x ${b.x} ${a.x + a.width > b.x}`,
        `a.x ${a.x} < b.x ${b.x} + b.width ${b.width} ${a.x < b.x + b.width}`,
        `a.y ${a.y} + a.height ${a.height} > b.y ${b.y} ${
          a.y + a.height > b.y
        }`,
        `a.y ${a.y} < b.y ${b.y} + b.height ${b.height} ${a.y < b.y + b.height}`
      );

    if (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    ) {
      return b;
    } else return false;
  }

  private _placeModelToLastPositionBeforeCollision(
    a: MovableModel,
    b: Sprite | Container
  ): void {
    if (!(a.prevPosition.x + a.width > b.x)) a.position.x = b.x - a.width;
    if (!(a.prevPosition.x < b.x + b.width)) a.position.x = b.x + a.width;
    if (!(a.prevPosition.y + a.height > b.y)) a.position.y = b.y - a.height;
    if (!(a.prevPosition.y < b.y + b.height)) a.position.y = b.y + a.height;
  }

  //Get an array of indexes of 2 blocks (same if standing still in the center),
  //where object (size of one block) was moved.
  //Can easyly be scalled for object of any size by using its height and width
  private _getPotentialCollisionsArea(
    position: IPoint,
    prevPosition: IPoint
  ): number[] {
    const minX = Math.min(
      Math.floor(position.x / BLOCK_SIZE),
      Math.floor(prevPosition.x / BLOCK_SIZE)
    );
    const minY = Math.min(
      Math.floor(position.y / BLOCK_SIZE),
      Math.floor(prevPosition.y / BLOCK_SIZE)
    );
    const maxX = Math.max(
      Math.ceil(position.x / BLOCK_SIZE),
      Math.ceil(prevPosition.x / BLOCK_SIZE)
    );
    const maxY = Math.max(
      Math.ceil(position.y / BLOCK_SIZE),
      Math.ceil(prevPosition.y / BLOCK_SIZE)
    );
    if (DEBUG) console.log("before = ", [minX, minY, maxX, maxY]);
    //const arr = [minX > 0 ? minX : 0, minY > 0 ? minY : 0, maxX, maxY];

    const arr = [
      minX > 0 ? minX : 0,
      minY > 0 ? minY : 0,
      maxX > WORLD_WIDTH - 1 ? WORLD_WIDTH - 1 : maxX,
      maxY > WORLD_HEIGHT - 1 ? WORLD_HEIGHT - 1 : maxY,
    ];

    if (DEBUG) console.log("_getPotentialCollisionsArea = ", arr);
    return arr;
  }

  //Get most closest block to position,
  //is used to prioritize bullets collisions
  private _getClosestBlockIndexes(position: IPoint): number[] {
    let x = Math.round(position.x / BLOCK_SIZE);
    let y = Math.round(position.y / BLOCK_SIZE);

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > WORLD_WIDTH - 1) x = WORLD_WIDTH - 1;
    if (y > WORLD_HEIGHT - 1) y = WORLD_HEIGHT - 1;

    return [x, y];
  }
}
