export class Key {
    code: string;
    isDown: boolean;
    isUp: boolean;
    press: Function;
    release: Function;
    downHandler: Function;
    upHandler: Function;

    constructor(keyCode: string, press: Function, release: Function) {
        this.code = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.press = press;
        this.release = release;
        //The `downHandler`
        this.downHandler = (event: KeyboardEvent) => {
            if (event.code === this.code) {
                if (this.isUp && this.press) {
                    this.press();
                }
                this.isDown = true;
                this.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        this.upHandler = (event: KeyboardEvent) => {
            if (event.code === this.code) {
                if (this.isDown && this.release) {
                    this.release();
                }
                this.isDown = false;
                this.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener('keydown', this.downHandler.bind(this), false);
        window.addEventListener('keyup', this.upHandler.bind(this), false);
        return this;
    }

    destroy() {
        window.removeEventListener('keydown', this.downHandler.bind(this));
        window.removeEventListener('keyup', this.upHandler.bind(this));
    }
}
