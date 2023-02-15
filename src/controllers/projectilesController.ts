import { TankModel } from "../models/tankModel";
import { AssetsService } from "../services/assetsService";
import { InputController, KEYS } from "./inputController";
import { Texture, Container } from "pixi.js";
import { BulletController } from "./bulletController";
import { BULLET_SPRITE_NAME } from "../services/constants";

export class ProjectilesController {
  private _bullets: BulletController[];
  private _world: Container;
  private _tankModel: TankModel;
  private _input: InputController;
  private _bulletTexture: Texture;

  constructor(world: Container, tankModel: TankModel, input: InputController) {
    this._bullets = [];
    this._world = world;
    this._tankModel = tankModel;
    this._input = input;
    this._bulletTexture = Texture.WHITE;
    this._setInput();
  }

  initAfterAssetsLoad() {
    this._bulletTexture = AssetsService.getTexture(BULLET_SPRITE_NAME);
  }

  get bullets(): BulletController[] {
    return this._bullets;
  }

  update() {
    this._bullets = this._bullets.filter((bullet) => {
      if (bullet.velocity !== 0) {
        bullet.update();
        return true;
      } else {
        bullet.destroy();
        return false;
      }
    });
  }

  destroy() {
    this._bullets.forEach((bullet) => {
      bullet.destroy();
    });
  }

  private _setInput() {
    this._input.setKey(
      KEYS.space,
      () => this._fire(), //Press
      () => null //Release
    );
  }

  private _fire() {
    if (!this._tankModel)
      throw new Error("tankModel was not provided to ProjectilesController");
    const bulletsPerShot = this._tankModel.bulletsPerShot;
    const delay = this._tankModel.delayBetweenBullets;
    this._fireRecursion(0, bulletsPerShot, delay);
  }

  //may be better to refactore using custom stack
  private _fireRecursion(
    shotNumber: number = 0,
    bulletsPerShot: number,
    delay: number
  ) {
    if (shotNumber >= bulletsPerShot) return;
    this._fireBullet();
    setTimeout(() => {
      this._fireRecursion(shotNumber + 1, bulletsPerShot, delay);
    }, delay);
  }

  private _fireBullet() {
    if (!this._tankModel)
      throw new Error("tankModel was not provided to ProjectilesController");
    this._tankModel.recoil();
    const bulletController = new BulletController(
      this._bulletTexture,
      this._tankModel.position,
      this._tankModel.direction,
      this._tankModel.color
    );
    this._world.addChild(bulletController.view);
    this._bullets.push(bulletController);
  }
}
