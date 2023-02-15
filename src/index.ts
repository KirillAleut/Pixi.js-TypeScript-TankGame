import { Application, BaseTexture, SCALE_MODES } from "pixi.js";
import { mainController } from "./controllers/mainController";
import { AssetsService } from "./services/assetsService";
import {
  DEFAULT_DEVICE_PIXEL_RATIO,
  AUTODENSITY,
  BACKGROUND_COLOR,
  INIT_WIDTH,
  INIT_HEIGHT,
} from "./services/constants";

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: DEFAULT_DEVICE_PIXEL_RATIO || 1,
  autoDensity: AUTODENSITY,
  backgroundColor: BACKGROUND_COLOR,
  width: INIT_WIDTH,
  height: INIT_HEIGHT,
});
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
const controller = new mainController(app);
AssetsService.loadAssets().then(() => {
  controller.initAfterAssetsLoad();
});
app.renderer.resize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
document.body.style.margin = "0";
