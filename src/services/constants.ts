//debug
export const DEBUG = true;

// app init settings
export const DEFAULT_DEVICE_PIXEL_RATIO = 1;
export const AUTODENSITY = true;
export const BACKGROUND_COLOR = 0x000000;
export const INIT_WIDTH = 640;
export const INIT_HEIGHT = 480;

//world generation
export const BLOCK_SIZE = 35; //px
export const WORLD_WIDTH = 50; //blocks
export const WORLD_HEIGHT = 50; //blocks

export const WALLS_COUNT = 50;
export const HAYS_COUNT = 25;
export const SPAWN_POINTS = 1;

//file and animation names
export const BULLET_SPRITE_NAME = "bullet.png";

export const enum TANK_COLOR_ASSET_NAMES {
  RED = "tank-red.png",
  GREEN = "tank-green.png",
  BLUE = "tank-blue.png",
}
export const BLINK_ANIMATION_NAME = "spawn-blink";

export const enum HAY_ASSET_NAMES {
  UNDAMAGED = "hay.png",
  DAMAGED = "hay-damaged.png",
  DAMAGED_2 = "hay-damaged-2.png",
}
export const enum WALL_ASSET_NAMES {
  UNDAMAGED = "wall.png",
}
export const EXPLOSION_ANIMATION_NAME = "explosion";

//some other model's constants are not here due to strong connection with their components
