import { Application, Container } from "pixi.js";
import { TankController } from "./tankController";
import { WorldController } from "./worldController";
import { InputController } from "./inputController";
import { ProjectilesController } from "./projectilesController";
import { BLOCK_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from "../services/constants";
import { DEBUG } from "../services/constants";

export class mainController {
  private _app: Application;
  private _camera: Container;
  private _worldController: WorldController;
  private _tankController: TankController;
  private _projectilesController: ProjectilesController;
  private _inputController: InputController;
  private _wasInit: boolean = false;

  constructor(app: Application) {
    if (DEBUG) console.groupCollapsed(`World Creation`);
    this._app = app;
    this._worldController = new WorldController();
    this._camera = new Container();
    this._camera.addChild(this._worldController.view);
    app.stage.addChild(this._camera);
    this._inputController = new InputController();
    this._tankController = new TankController(
      this._inputController,
      this._worldController.tankSpawnPoint
    );
    this._projectilesController = new ProjectilesController(
      this._worldController.view,
      this._tankController.model,
      this._inputController
    );
    this.update = this.update.bind(this);
    app.ticker.add(this.update);
  }

  initAfterAssetsLoad() {
    this._worldController.initAfterAssetsLoad();
    this._tankController.initAfterAssetsLoad();
    this._addPlayerTankOnWorldMap();
    this._projectilesController.initAfterAssetsLoad();
    this._wasInit = true;
    if (DEBUG) console.groupEnd();
  }

  //main cicle: move tank, projectiles, check colisions and trigger their interections, move camera
  update() {
    if (!this._wasInit) return;
    // if (DEBUG) {
    //   console.groupEnd();
    //   console.groupCollapsed(`update cicle`);
    // }
    this._tankController.update();
    this._projectilesController.update();
    this._processTanksCollisions();
    this._processBulletsCollisions();
    this._handleCamera();
  }

  private _addPlayerTankOnWorldMap() {
    this._worldController.view.addChild(this._tankController.view);
  }

  private _processBulletsCollisions() {
    if (this._projectilesController)
      this._projectilesController.bullets.forEach((bullet) => {
        if (this._worldController.processBulletsCollisions(bullet.model))
          bullet.destroy();
      });
  }

  private _processTanksCollisions() {
    if (this._tankController && this._tankController.model.wasMoved) {
      this._worldController.processTanksCollisions(this._tankController.model);
      this._tankController.applyMotion();
    }
  }

  //camera centered on player, but edged by world size
  private _handleCamera() {
    const screenWidthHalf = this._app.screen.width / 2;
    const screenHeightHalf = this._app.screen.height / 2;
    if (this._tankController) {
      let position = this._tankController.viewPosition;
      if (position.x > WORLD_WIDTH * BLOCK_SIZE - screenWidthHalf) {
        position.x = WORLD_WIDTH * BLOCK_SIZE - screenWidthHalf;
      }
      if (position.y > WORLD_HEIGHT * BLOCK_SIZE - screenHeightHalf) {
        position.y = WORLD_HEIGHT * BLOCK_SIZE - screenHeightHalf;
      }
      if (position.x < screenWidthHalf) {
        position.x = screenWidthHalf;
      }
      if (position.y < screenHeightHalf) {
        position.y = screenHeightHalf;
      }
      this._camera.pivot = position;
    }
    this._camera.position.set(screenWidthHalf, screenHeightHalf);
  }
}
