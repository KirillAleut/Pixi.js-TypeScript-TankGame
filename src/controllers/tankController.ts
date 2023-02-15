import { IPoint } from "pixi.js";
import { TankModel, TANK_COLORS_COUNT } from "../models/tankModel";
import { TankView } from "../view/tankView";
import { InputController, KEYS } from "./inputController";

export class TankController {
  private _view: TankView | undefined;
  private _model: TankModel;
  private _input: InputController;

  constructor(input: InputController, position: IPoint) {
    this._model = new TankModel(position, this._getRandomStartColor());
    this._model.visible = false;
    this._input = input;
    this._setInput();
  }

  get model(): TankModel {
    return this._model;
  }

  get view(): TankView {
    if (this._view === undefined)
      throw new Error("TankView was not initialized");
    return this._view;
  }

  get viewPosition(): IPoint {
    return this.view.position.clone();
  }

  initAfterAssetsLoad() {
    this._view = new TankView(this._model.color);
    this._view.position = this._model.position.clone();
  }

  applyMotion() {
    if (this._view === undefined)
      throw new Error("TankView was not initialized");
    this._view.position.x = this._model.position.x;
    this._view.position.y = this._model.position.y;
    this._model.wasMoved = false;
  }

  update() {
    if (this._view !== undefined) {
      this._accelerate();
      this._model.move();
      this._view.activeSprite.angle = this._model.angle;
    }
  }

  destroy() {
    if (this._view === undefined)
      throw new Error("TankView was not initialized");
    this._view.destroy();
  }

  private _setInput(): void {
    this._input.setKey(
      KEYS.left,
      () => this._model.rotate(false), //Press
      () => null //Release
    );
    this._input.setKey(
      KEYS.right,
      () => this._model.rotate(true), //Press
      () => null //Release
    );
    this._input.setKey(
      KEYS.up,
      () => null, //Press
      () => null //Release
    );
    this._input.setKey(
      KEYS.down,
      () => null, //Press
      () => null //Release
    );
    this._input.setKey(
      KEYS.t,
      () => this._switchColor(), //Press
      () => null //Release
    );
  }

  private _getRandomStartColor(): number {
    return Math.floor(Math.random() * TANK_COLORS_COUNT);
  }

  private _switchColor(): void {
    if (this._view === undefined)
      throw new Error("TankView was not initialized");
    this._model.switchColorToNext();
    this._view.switchColor(this._model.color);
  }

  private _accelerate() {
    if (this._input.up?.isDown && this._input.down?.isUp)
      this._model.accelerate(true);
    if (this._input.down?.isDown && this._input.up?.isUp)
      this._model.accelerate(false);
  }
}
