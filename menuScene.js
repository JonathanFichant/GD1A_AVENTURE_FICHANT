const BG_SIZE = 512;
var mx;
var my;

export class menuScene extends Phaser.Scene {

    constructor() {
        super("menuScene");
        this.controller = false;
        this.keyboard;
    }

    init(data) {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.entrance = data.entrance;
    }

    preload() {
        this.load.image('caisse', 'assets/caisse.png')
        this.load.image('blocCible', 'assets/blocCible.png');
        this.load.image('poids', 'assets/poids.png');
        this.load.image('ombreJoueur', 'assets/ombreJoueur.png')
        this.load.spritesheet('lifeBarre', 'assets/lifeBarre.png',
            { frameWidth: 32 * 7, frameHeight: 64 });
        this.load.image('compteurMaillons','assets/maillon.png');
        this.load.image('faux', 'assets/faux.png');
        this.load.spritesheet('chaine', 'assets/chaine.png',
            { frameWidth: 32 * 7, frameHeight: 32 });
        this.load.image('maillon', 'assets/maillon.png');
        this.load.spritesheet('animStun', 'assets/animStun.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('etapeArme', 'assets/stepArme.png',
            { frameWidth: 141, frameHeight: 51 });
        this.load.image('coeur', 'assets/coeur.png');
        this.load.image('bambous', 'assets/bambous.png');
        this.load.image('mentor', 'assets/mentor.png');
        this.load.image('ecranTitre', 'assets/ecranTitreZelda.png');
        this.load.spritesheet('idle', 'assets/ninja_idle.png',
            { frameWidth: 18, frameHeight: 32 }
        )
        this.load.spritesheet('animDroite', 'assets/ninja_marche_droite.png',
            { frameWidth: 20, frameHeight: 32 }
        )
        this.load.spritesheet('animGauche', 'assets/ninja_marche_gauche.png',
            { frameWidth: 20, frameHeight: 32 }
        )
        this.load.spritesheet('animBas', 'assets/ninja_marche_bas.png',
            { frameWidth: 18, frameHeight: 32 }
        )
        this.load.spritesheet('animHaut', 'assets/ninja_marche_haut.png',
            { frameWidth: 20, frameHeight: 32 }
        )
        this.load.spritesheet('marcheSamurai', 'assets/samurai1_marche.png',
            { frameWidth: 20, frameHeight: 32 }
        )
        this.load.image('tileset1', 'tiled/tilesetZelda.png'); //import du tileset
        this.load.tilemapTiledJSON('niveau1', 'tiled/level1_zelda.json'); // import fichier tiled
    }

    create() {
        
        this.cameras.main.fadeIn(1300,0,0,0);
        this.keyboard = this.input.keyboard.createCursorKeys();
        this.controller = false;
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        })

        this.background = this.add.image(1920, 1080, 'ecranTitre');
        this.background.setOrigin(1,1);
        this.cameras.main.setZoom(1);
    };

    update() {

        if (this.keyboard.space.isDown) {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('niveau1', {entrance :'menuScene'});
            })
        }
    }
};
