export class sceneFin extends Phaser.Scene {

    constructor() {
        super("sceneFin");
        this.controller = false;
        this.keyboard;
    }

    init(data) {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.entrance = data.entrance;
    }

    preload() {
    }

    create() {
        
        this.cameras.main.fadeIn(1000,0,0,0);
        this.keyboard = this.input.keyboard.createCursorKeys();
        this.controller = false;
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        })

        this.background = this.add.image(1920, 1080, 'ecranFin');
        this.background.setOrigin(1,1);
        this.cameras.main.setZoom(1);
    };

    update() {

        if (this.keyboard.space.isDown) {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('menuScene');
            })
        }
    }
};
