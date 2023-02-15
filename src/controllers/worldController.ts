import { Point } from "pixi.js";
import { CollisionsController } from "./collisionsController";
import { WorldView } from "../view/scenes/world";
import { WorldModel } from "../models/worldModel";
import { MovableModel } from "../models/movableModel";
import { BulletModel } from "../models/bulletModel";

export class WorldController {
  private _model: WorldModel;
  private _view: WorldView;
  private _collisionsController: CollisionsController;

  constructor() {
    this._model = new WorldModel();
    this._view = new WorldView();

    this._collisionsController = new CollisionsController(this._model);
  }

  get view(): WorldView {
    return this._view;
  }

  get tankSpawnPoint(): Point {
    return this._model.tankSpawnPoint;
  }

  initAfterAssetsLoad() {
    this._model.fillSpriteMap(this._view);
  }

  processTanksCollisions(tank: MovableModel): void {
    this._collisionsController.processTanksCollisions(tank);
  }

  processBulletsCollisions(bullet: BulletModel): boolean {
    return this._collisionsController.processBulletsCollisions(bullet);
  }
}
