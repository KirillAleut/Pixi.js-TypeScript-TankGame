import { Key } from "./key";

export enum KEYS {
  left = "ArrowLeft",
  right = "ArrowRight",
  up = "ArrowUp",
  down = "ArrowDown",
  t = "KeyT",
  space = "Space",
}

export class InputController {
  left: Key | undefined;
  right: Key | undefined;
  up: Key | undefined;
  down: Key | undefined;
  keyT: Key | undefined;
  space: Key | undefined;

  constructor() {}

  setKey(keyCode: KEYS, press: Function, release: Function) {
    const newKey = new Key(keyCode, press, release);
    switch (keyCode) {
      case KEYS.left:
        this.left = newKey;
        break;
      case KEYS.right:
        this.right = newKey;
        break;
      case KEYS.up:
        this.up = newKey;
        break;
      case KEYS.down:
        this.down = newKey;
        break;
      case KEYS.t:
        this.keyT = newKey;
        break;
      case KEYS.space:
        this.space = newKey;
        break;
      default:
        throw new Error("Wrong TankColor value");
    }
  }

  destroy() {
    if (this.left) this.left.destroy();
    if (this.right) this.right.destroy();
    if (this.up) this.up.destroy();
    if (this.down) this.down.destroy();

    if (this.keyT) this.keyT.destroy();
    if (this.space) this.space.destroy();
  }
}
