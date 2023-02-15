import { Assets, Sprite, AnimatedSprite, Texture } from "pixi.js";

export abstract class AssetsService {
  private static _animations: Record<string, string[]>;

  constructor() {}

  public static async loadAssets(): Promise<void | Record<string, any>> {
    return Assets.load(["tankgame-tiles.json"]).then(() => {
      AssetsService.createAnimations();
    });
  }

  public static createAnimations() {
    this._animations = Assets.cache.get("tankgame-tiles.json").data
      .animations as Record<string, string[]>;
  }

  public static getSprite(spriteName: string): Sprite {
    return Sprite.from(spriteName);
  }

  public static getTexture(spriteName: string): Texture {
    return Texture.from(spriteName);
  }

  public static getAnimatedSprite(spriteName: string): AnimatedSprite {
    if (this._animations === undefined)
      throw Error("animations was not extracted");
    return AnimatedSprite.fromFrames(AssetsService._animations[spriteName]);
  }
}
