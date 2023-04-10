import { niveau1 as niveau1} from "./niveau1.js";
import { niveau2 as niveau2 } from "./niveau2.js";
import { niveau3 as niveau3 } from "./niveau3.js";
import { menuScene as menuScene} from "./menuScene.js";
import { niveau4 as niveau4} from "./niveau4.js";
import { niveau5 as niveau5 } from "./niveau5.js";
import { niveau6 as niveau6 } from "./niveau6.js";
import { niveau7 as niveau7} from "./niveau7.js";
import { niveau8 as niveau8 } from "./niveau8.js";
import { sceneFin as sceneFin } from "./sceneFin.js";




var config = { // initialisation de phaser
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT, //La fenetre s'adapte avec le même ratio
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true// en true permet de voir les hitbox et trajectoires
        }
    },
    pixelArt: true,
    input: { gamepad: true },
    scene: [niveau1, menuScene, niveau2, niveau3, niveau4, niveau5, niveau6, niveau7, niveau8, sceneFin] // REMETTRE menuScene en 1er
};

new Phaser.Game(config);
//var game = new Phaser.Game(config);
//game.scene.start("niveau0"); // Le jeu commence à cette scène