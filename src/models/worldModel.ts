import { Container, Point } from "pixi.js";
import { BlockView } from "../view/bloсkView";
import { WallBlock } from "../view/wallBlock";
import { HayBlock } from "../view/hayBlock";
import {
  DEBUG,
  BLOCK_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WALLS_COUNT,
  HAYS_COUNT,
  SPAWN_POINTS,
} from "../services/constants";

export class WorldModel {
  private _blockPositions: number[][];
  private _spriteMap: (BlockView | false)[][];

  constructor() {
    this._blockPositions = this._generateUniquePositions();
    this._spriteMap = this._createFalseCellsMap();
  }

  get spriteMap(): (BlockView | false)[][] {
    return Object.assign(this._spriteMap);
  }

  get tankSpawnPoint(): Point {
    const [x, y] = this._blockPositions[this._blockPositions.length - 1];
    return new Point(x * BLOCK_SIZE, y * BLOCK_SIZE);
  }

  fillSpriteMap(view: Container): void {
    const positions = this._blockPositions;
    if (DEBUG) {
      if (DEBUG) console.groupCollapsed(`WorldModel`);
      console.log("positions = ", positions);
    }
    const wallsPositions = positions.slice(0, WALLS_COUNT);
    const haysPositions = positions.slice(
      WALLS_COUNT,
      WALLS_COUNT + HAYS_COUNT
    );
    if (DEBUG) console.log("wallsPositions = ", wallsPositions);
    if (DEBUG) console.log("haysPositions = ", haysPositions);
    wallsPositions.forEach((pos) => {
      const [x, y] = pos;
      const wall = new WallBlock();
      wall.x = x * BLOCK_SIZE;
      wall.y = y * BLOCK_SIZE;
      wall.positionInWorldArray.x = x;
      wall.positionInWorldArray.y = y;
      this._spriteMap[x][y] = wall;
      view.addChild(wall);
    });
    haysPositions.forEach((pos) => {
      const [x, y] = pos;
      const hay = new HayBlock();
      hay.x = x * BLOCK_SIZE;
      hay.y = y * BLOCK_SIZE;
      hay.positionInWorldArray.x = x;
      hay.positionInWorldArray.y = y;
      this._spriteMap[x][y] = hay;
      view.addChild(hay);
    });
    if (DEBUG) {
      console.log("spriteMapInit = ", this._spriteMap);
      console.log("spriteMapInteractive (uncollapse every array) = ");
      console.dir(this._spriteMap);
      console.groupEnd();
    }
  }

  damageBlock(xIndex: number, yIndex: number, damage: number): void {
    let block = this._spriteMap[xIndex][yIndex];
    if (!block) {
      console.warn("attempt to delete already false block");
    } else {
      block.playAnimation();
      if (block instanceof HayBlock) {
        block.dealDamage(damage);
        if (block.hitpoints <= 0) {
          this._deleteSpriteMapElement(xIndex, yIndex);
        }
      }
    }
  }

  private _deleteSpriteMapElement(xIndex: number, yIndex: number): void {
    let block = this._spriteMap[xIndex][yIndex];
    if (!block) {
      console.warn("attempt to delete already false block");
    } else {
      block.removeFromParent();
      this._spriteMap[xIndex][yIndex] = false;
    }
  }

  private _generateUniquePositions(
    quantity: number = WALLS_COUNT + HAYS_COUNT + SPAWN_POINTS,
    maxX: number = WORLD_WIDTH,
    maxY: number = WORLD_HEIGHT
  ): number[][] {
    // create set of string coordinates "Xcoordinate;Ycoordiate"
    const set = new Set<string>();
    while (set.size < quantity) {
      set.add(
        `${Math.floor(Math.random() * maxX)};${Math.floor(
          Math.random() * maxY
        )}`
      );
    }
    //Transform it to an array of number pairs [[Xcoord,Ycoord]...]
    return [...set].map(function (val: string) {
      return val.split(";").map((str: string) => parseInt(str));
    });
  }

  private _createFalseCellsMap(): false[][] {
    let map: false[][] = [];
    for (let i = 0; i < WORLD_WIDTH; i++) {
      map[i] = [];
      for (let j = 0; j < WORLD_HEIGHT; j++) {
        map[i][j] = false;
      }
    }
    return map;
  }
}
