const BG_SIZE = 512;
var mx;
var my;

export class menuScene extends Phaser.Scene{

    constructor(){
        super("menuScene");

        this.click = false;
        this.controller = false;
        this.keyboard;
    }

	init(){
		this.cameras.main.fadeIn(400, 0, 0, 0);
	}
    preload(){
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('button','assets/play_button.png',
                    { frameWidth: 128, frameHeight: 64 });
    }
    create(){
        this.keyboard = this.input.keyboard.createCursorKeys();
        this.controller = false;
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        })
        this.background = this.add.image(BG_SIZE, BG_SIZE / 1.5, 'background');
        this.button = this.add.sprite( BG_SIZE,BG_SIZE / 1.5, 'button');

        const layer = this.add.layer();
        layer.add([ this.background, this.button ])

        this.cameras.main.setZoom(1);

        this.anims.create({
            key: 'button_idle',
            frames: [ { key: 'button', frame: 0} ],
            frameRate: 1,
            repeat: 0
        });
        this.anims.create({
            key: 'button_hover',
            frames: [ { key: 'button', frame: 1} ],
            frameRate: 1,
            repeat: 0
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown', () => this.click = true);
    };
    update(){
        mx = this.input.mousePointer.x;
        my = this.input.mousePointer.y;

        this.background.x = (((BG_SIZE) * (mx / BG_SIZE)  * 0.01) + (BG_SIZE));
        this.background.y = (((BG_SIZE) * (my / BG_SIZE)) * 0.01) + (BG_SIZE / 1.5);

        if ((mx >= 320 && mx <= 700 && my >= 210 && my <= 400) || this.keyboard.space.isDown )
        {
            this.button.anims.play('button_hover');
            if (this.click == true)
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.time.delayedCall(400, () => {
					this.scene.start('niveau1');
                })
        }
        else
        {
            this.button.anims.play('button_idle');
        }
        this.click = false;
    }
};
