export class niveau2 extends Phaser.Scene {
    constructor() {
        super("niveau2");
        // déclaration de toutes les variables utiles
        this.cursors;
        this.stars;
        this.bombs;
        this.gameOver = false;
        this.speed = 150;
        this.invulnerable = false;
        this.directionPlayer = 'down';
        this.cdCAC = false;
        this.atkCAC = false;
        this.atkFauxCAC = false;
        this.stunPlayer = false;
        //this.priere = false;

        // faux + poids 

        this.checkGrappin2 = false;
        this.checkGrappinUsed = false;
        this.cdGrappin = false;
        this.speedPoids = 300;
        this.jumpGrappin = false;
        //this.longueurChaine = 60 //211 max (131 pour passer la rivière)
        // on commence à 60 ?

        this.temp3 = 0;

        this.varTest = 0;
        this.cdClignotement = 4;

        this.keyboard;

        this.keyF;
        this.keyR;
        this.keyG;
        this.keyT;
        this.keyE;
        this.keyZ; // à intégrer dans les inuput
        this.keyQ;
        this.keys;
        this.keyD;

        // Variable du mob
        this.mobX = true;
        this.temp = false;
        this.speedMob = 70;
        this.directionMob = 'right';
        this.modeAggro = false;
        this.diagoX = 0; // pour éviter déplacement diagonale rapide
        this.diagoY = 0;
        this.visionRange = 50;
        this.angleMob = 0; // sa direction, pas défaut à droite, (gauche : Math.PI, haut : Math.PI/2, bas : -Math.PI/2)
        this.fovMob = Math.PI / 2 // son champ de vision, 90 degrés ici
        this.cdMob = false;
        this.mobInvulnerable = false;
        this.lifeMob = 1;
        this.mobDead = false;
        this.stunMob = false;

    }

    init(data) {
        this.entrance = data.entrance;
        if (this.entrance == "niveau1")
            this.cameras.main.fadeIn(1000, 0, 0, 0); // durée du degradé, puis valeur RVB
        else {
            this.cameras.main.fadeIn(1400, 0, 0, 0);
        }
        this.priere = data.priere;
        this.lifePlayer = data.lifePlayer;
        this.nbMaillons = data.nbMaillons;
        this.longueurChaine = data.longueurChaine;
        this.stepArme = data.stepArme;

    }


    preload() { // préchargement des assets
        this.load.image('ombreJoueur','assets/ombreJoueur.png')
        this.load.image('poids', 'assets/poids.png');
        //this.load.image('faux', 'assets/faux.png');
        this.load.image('compteurMaillons','assets/maillon.png');
        this.load.spritesheet('chaine', 'assets/chaine.png',
            { frameWidth: 32 * 7, frameHeight: 32 });
        this.load.spritesheet('lifeBarre', 'assets/lifeBarre.png',
            { frameWidth: 32 * 7, frameHeight: 64 });
        this.load.image('maillon', 'assets/maillon.png');
        this.load.image('coeur', 'assets/coeur.png');
        this.load.image('bambous', 'assets/bambous.png');
        this.load.image('tileset2', 'tiled/tilesetZelda.png'); //import du tileset
        this.load.tilemapTiledJSON('niveau2', 'tiled/lvl2_zelda.json'); // import fichier tiled
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

    };

    create() { // Création des éléments dès l'initialisation du jeu


        this.map2 = this.add.tilemap('niveau2');
        this.tileset = this.map2.addTilesetImage('tilesetZelda', 'tileset2');

        // Import de tous les calques

        this.calque_sol = this.map2.createLayer('Sol', this.tileset);
        this.calque_bambous_cassables = this.map2.getObjectLayer('Bambous_cassables');
        this.calque_bambous = this.map2.createLayer('Bambous', this.tileset);
        this.statue = this.map2.createLayer('Statue', this.tileset);

        this.calque_bambous.setCollisionByProperty({ isSolid: true });
        this.statue.setCollisionByProperty({ isSolid: true });


        this.cursors = this.input.keyboard.createCursorKeys(); // variable pour input

        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.controller = false;
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        })


        this.maillon = this.physics.add.staticGroup();


        this.coeur = this.physics.add.staticGroup();



        this.blocCible = this.physics.add.sprite(656, 272, 'blocCible');
        this.blocCible.visible = false;


        // SPAWN

        if (this.entrance == 'niveau1') {
            this.player = this.physics.add.sprite(580, 800, 'ninja');
        }
        else {
            this.player = this.physics.add.sprite(580, 800, 'ninja');
        }
        this.player.setSize(14, 28).setOffset(2, 3);
        this.player.setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.calque_bambous);
        this.physics.add.collider(this.player, this.statue);


        this.bambous = this.physics.add.staticGroup();

        this.calque_bambous_cassables.objects.forEach(eachBambous => {
            this.bambou = this.bambous.create(eachBambous.x + 16, eachBambous.y - 16, 'bambous');
        });
        this.physics.add.collider(this.player, this.bambous);

        this.chaine = this.physics.add.sprite(0, 0, 'chaine');
        this.chaine.setOrigin(0, 0.5);


        this.poids = this.physics.add.sprite(0, 0, 'poids');
        this.poids.setCollideWorldBounds(true);
        this.poids.setOrigin(0.5, 0.5);
        this.physics.add.collider(this.poids, this.calque_bambous);
        this.physics.add.collider(this.poids, this.statue);
        this.physics.add.collider(this.poids, this.bambous);


        this.faux = this.physics.add.sprite(0, 0, 'faux');
        this.faux.setCollideWorldBounds(true);
        this.faux.setOrigin(0.5, 0.5);
        this.physics.add.collider(this.faux, this.calque_bambous);
        this.physics.add.collider(this.faux, this.statue);


        this.physics.world.setBounds(0, 0, 640, 960); // Défini les limites où le joueur peut aller
        this.cameras.main.setBounds(0, 0, 640, 960); // Défini les limites de la caméra (début x, début y, fin x, fin y)
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); //ancrage de la caméra sur l'objet player
        this.cameras.main.setZoom(4);

        this.lifeBarre = this.physics.add.sprite(720, 415, 'lifeBarre'); // le sprite s'affiche 
        this.lifeBarre.setScrollFactor(0);
        this.lifeBarre.setOrigin(0, 0);

        /*this.etapeArme = this.physics.add.sprite(1052, 410, 'etapeArme');
        this.etapeArme.setScrollFactor(0);
        this.etapeArme.setOrigin(0, 0);
        this.etapeArme.fixedToCamera = true;*/

        this.compteurMaillons = this.physics.add.sprite(724, 650, 'compteurMaillons');
        this.compteurMaillons.setScrollFactor(0);
        this.compteurMaillons.setOrigin(0, 0);
        this.compteurMaillons.fixedToCamera = true;

        this.compteurMaillonsText = this.add.text(744,650, 'x ' + this.nbMaillons, { font: '16px Arial', fill: '#ffffff' });
        this.compteurMaillonsText.setScrollFactor(0);
        this.compteurMaillonsText.setOrigin(0, 0);
        this.compteurMaillonsText.fixedToCamera = true;



        this.anims.create({
            key: 'animChaine',
            frames: this.anims.generateFrameNumbers('chaine', { start: 0, end: 13 }),
            repeat: 0,
            frameRate: this.speedPoids / 15, // syncro à revoir
        })

        this.anims.create({
            key: 'life7',
            frames: [{ key: 'lifeBarre', frame: 7 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life6',
            frames: [{ key: 'lifeBarre', frame: 6 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life5',
            frames: [{ key: 'lifeBarre', frame: 5 }],
            repeat: 0,
            frameRate: 1,
        })

        this.anims.create({
            key: 'life4',
            frames: [{ key: 'lifeBarre', frame: 4 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life3',
            frames: [{ key: 'lifeBarre', frame: 3 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life2',
            frames: [{ key: 'lifeBarre', frame: 2 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life1',
            frames: [{ key: 'lifeBarre', frame: 1 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'life0',
            frames: [{ key: 'lifeBarre', frame: 0 }],
            repeat: 0,
            frameRate: 1,
        });

        this.anims.create({
            key: 'idleRight',
            frames: this.anims.generateFrameNumbers('idle', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'idleUp',
            frames: this.anims.generateFrameNumbers('idle', { start: 3, end: 3 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'idleLeft',
            frames: this.anims.generateFrameNumbers('idle', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'idleDown',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('animGauche', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('animDroite', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('animBas', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('animHaut', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: -1
        });

        this.ombreJoueur = this.add.sprite(0,0,'ombreJoueur');
        

        if (this.entrance == 'niveau1') {
            this.directionPlayer = 'left';
        }
        else {
            this.directionPlayer = 'left';
        }

        this.physics.add.overlap(this.faux, this.bambous, this.coupeBambou, null, this);
        this.physics.add.overlap(this.player, this.maillon, this.recupMaillon, null, this)  // ramassage maillon
        this.physics.add.overlap(this.player, this.coeur, this.recupCoeur, null, this)  // ramassage maillon

        switch (this.lifePlayer) {
            case 7:
                this.lifeBarre.anims.play('life7', true);
                break;
            case 6:
                this.lifeBarre.anims.play('life6', true);
                break;
            case 5:
                this.lifeBarre.anims.play('life5', true);
                break;
            case 4:
                this.lifeBarre.anims.play('life4', true);
                break;
            case 3:
                this.lifeBarre.anims.play('life3', true);
                break;
            case 2:
                this.lifeBarre.anims.play('life2', true);
                break;
            case 1:
                this.lifeBarre.anims.play('life1', true);
                break;
            case 0:
                this.lifeBarre.anims.play('life0', true);
                break;
        }

    }





    update() {
        if (this.gameOver) { return; }

        this.ombreJoueur.x = this.player.x;
        this.ombreJoueur.y = this.player.y + 3;

        // ANIMATION ET DEPLACEMENT 8 DIRECTIONS

        if (!(this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown
            || this.keyZ.isDown || this.keyQ.isDown || this.keyS.isDown || this.keyD.isDown) || this.checkGrappinUsed == true || this.controller.left
            || this.controller.right || this.controller.up || this.controller.down) { // Si aucune touche n'est appuyée alors idle
            if (this.directionPlayer == 'up') {
                this.player.anims.play('idleUp', true);
            }
            if (this.directionPlayer == 'down') {
                this.player.anims.play('idleDown', true);
            }
            if (this.directionPlayer == 'right') {
                this.player.anims.play('idleRight', true);
            }
            if (this.directionPlayer == 'left') {
                this.player.anims.play('idleLeft', true);
            }
            this.player.setVelocity(0);
        }
        // 8 DIRECTIONS
        if (this.checkGrappinUsed == false && this.jumpGrappin == false && this.stunPlayer == false) { // Pendant l'animation du grappin le joueur ne peut plus bouger
            if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left) && (this.cursors.up.isUp && this.keyZ.isUp && !this.controller.up) && (this.cursors.down.isUp && this.keyS.isUp && !this.controller.down)) { // GAUCHE
                this.player.setVelocityX(-this.speed); //
                this.player.setVelocityY(0)
                this.player.anims.play('left', true);
                this.directionPlayer = 'left';
            }
            else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right) && (this.cursors.up.isUp && this.keyZ.isUp && !this.controller.up) && (this.cursors.down.isUp && this.keyS.isUp && !this.controller.down)) { // DROITE
                this.player.setVelocityX(this.speed); //
                this.player.setVelocityY(0)
                this.player.anims.play('right', true);
                this.directionPlayer = 'right';
            }
            else if ((this.cursors.down.isDown || this.keyS.isDown || this.controller.down) && (this.cursors.right.isUp && this.keyD.isUp && !this.controller.right) && (this.cursors.left.isUp && this.keyQ.isUp && !this.controller.left)) { // BAS
                this.player.setVelocityX(0)
                this.player.setVelocityY(this.speed); //
                this.player.anims.play('down', true);
                this.directionPlayer = 'down';
            }
            else if ((this.cursors.up.isDown || this.keyZ.isDown || this.controller.up) && (this.cursors.right.isUp && this.keyD.isUp && !this.controller.right) && (this.cursors.left.isUp && this.keyQ.isUp && !this.controller.left)) { // HAUT
                this.player.setVelocityX(0)
                this.player.setVelocityY(-this.speed); 
                this.player.anims.play('up', true);
                this.directionPlayer = 'up';
            }
            else if ((this.cursors.up.isDown || this.keyZ.isDown || this.controller.up) && (this.cursors.right.isDown || this.keyD.isDown || this.controller.right)) { // HAUT DROITE
                this.player.setVelocityX(this.speed * 0.7071); //alors vitesse positive en X
                this.player.setVelocityY(-this.speed * 0.7071);
                this.player.anims.play('up', true);
                this.directionPlayer = 'up';
            }
            else if ((this.cursors.up.isDown || this.keyZ.isDown || this.controller.up) && (this.cursors.left.isDown || this.keyQ.isDown || this.controller.left)) { // HAUT GAUCHE
                this.player.setVelocityX(-this.speed * 0.7071); //alors vitesse positive en X
                this.player.setVelocityY(-this.speed * 0.7071)
                this.player.anims.play('up', true);
                this.directionPlayer = 'up';
            }
            else if ((this.cursors.down.isDown || this.keyS.isDown || this.controller.down) && (this.cursors.right.isDown || this.keyD.isDown || this.controller.right)) { // BAS DROITE
                this.player.setVelocityX(this.speed * 0.7071); //alors vitesse positive en X
                this.player.setVelocityY(this.speed * 0.7071)
                this.player.anims.play('down', true);
                this.directionPlayer = 'down';
            }
            else if ((this.cursors.down.isDown || this.keyS.isDown || this.controller.down) && (this.cursors.left.isDown || this.keyQ.isDown || this.controller.left)) { // BAS GAUCHE
                this.player.setVelocityX(-this.speed * 0.7071); //alors vitesse positive en X
                this.player.setVelocityY(this.speed * 0.7071)
                this.player.anims.play('down', true);
                this.directionPlayer = 'down';
            }
            /*else if (this.stunPlayer == false) { // sinon
                this.player.setVelocity(0); //vitesse nulle
            }*/
        }


        // check variable

        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
            console.log(this.longueurChaine)
            console.log(this.lifePlayer)
            console.log(this.player.x)
            console.log(this.player.y)
            //this.player.setTint();
        }

        // PRIERE DEVANT LA STATUE
        if ((Phaser.Input.Keyboard.JustDown(this.keyE) || this.controller.A) && this.player.x >= 231 && this.player.x <= 280 && this.player.y >= 200 && this.player.y <= 226) {
            // Ligne de dialogue à rajouter ?
            // bloquer la prière tant que le mentor ne l'a pas demandé ou rendre inaccessible le niveau avant
            if (this.priere != true) {
                this.priere = true;
                this.stunPlayer = true;
                this.cameras.main.fadeOut(600, 255, 255, 255);
                this.time.delayedCall(600, () => {
                    this.cameras.main.fadeIn(600, 255, 255, 255);
                    this.stunPlayer = false;
                })
            }

        }



        // ATTAQUE AU CAC



        if ((Phaser.Input.Keyboard.JustDown(this.keyF)|| this.controller.X) && this.cdGrappin == false) { // Attaque au CAC
            this.cdGrappin = true;
            this.atkFauxCAC = true;
            this.time.delayedCall(500, function () { // Cooldown avant de pouvoir retaper
                this.cdGrappin = false;
            }, [], this);
            this.time.delayedCall(350, function () { // cooldown d'animation
                this.atkCAC = true;
            }, [], this);
            this.faux.enableBody(true, true);

            this.poids.x = this.player.x;
            this.poids.y = this.player.y;
            this.faux.visible = true;
            this.checkGrappinUsed = true;
            this.temp3 = 0;

            if (this.directionPlayer == 'right') {
                this.faux.x = this.player.x + 14;
                this.faux.y = this.player.y - 8;
                this.faux.angle = -100;
                this.faux.setVelocityY(80);
            }
            if (this.directionPlayer == 'left') {
                this.faux.angle = 80;
                this.faux.x = this.player.x - 16;
                this.faux.y = this.player.y + 24;
                this.faux.setVelocityY(-80);

            }
            if (this.directionPlayer == 'up') {
                this.faux.x = this.player.x - 22;
                this.faux.y = this.player.y - 12;
                this.faux.angle = 170;
                this.faux.setVelocityX(80);
            }
            if (this.directionPlayer == 'down') {
                this.faux.x = this.player.x + 20;
                this.faux.y = this.player.y + 24;
                this.faux.angle = -10;
                this.faux.setVelocityX(-80);
            }
        }

        if (this.atkFauxCAC == true && this.temp3 < 120) {
            this.faux.angle += 6;
            this.temp3 += 6;
        }



        // GRAPPIN


        if (this.checkGrappinUsed == true) {
            this.player.setVelocity(0);
        }

        if ((Phaser.Input.Keyboard.JustDown(this.keyG) || this.controller.Y) && this.cdGrappin == false && this.stepArme > 1) { // lancer de poids / grappin
            this.cdGrappin = true;
            this.time.delayedCall(700, function () {
                this.cdGrappin = false;
            }, [], this);
            this.poids.enableBody(true, true);
            this.poids.x = this.player.x;
            this.poids.y = this.player.y;
            this.faux.x = this.player.x;
            this.faux.y = this.player.y;
            this.chaine.x = this.player.x;
            this.chaine.y = this.player.y;
            this.poids.visible = true;
            this.chaine.visible = true;
            this.checkGrappinUsed = true;



            if (this.directionPlayer == 'right') {
                this.poids.angle = 0;
                this.chaine.angle = 0;
                this.poids.setVelocityX(this.speedPoids);
                this.poids.setVelocityY(0);
                this.chaine.anims.play('animChaine', true);
                //this.useGrappin2(200,0);
            }
            if (this.directionPlayer == 'left') {
                this.poids.angle = 180;
                this.chaine.angle = 180;
                this.poids.setVelocityX(-this.speedPoids);
                this.poids.setVelocityY(0);
                this.chaine.anims.play('animChaine', true);
            }
            if (this.directionPlayer == 'up') {
                this.poids.angle = -90;
                this.chaine.angle = -90;
                this.poids.setVelocityX(0);
                this.poids.setVelocityY(-this.speedPoids);
                this.chaine.anims.play('animChaine', true);
            }
            if (this.directionPlayer == 'down') {
                this.poids.angle = 90;
                this.chaine.angle = 90;
                this.poids.setVelocityX(0);
                this.poids.setVelocityY(this.speedPoids);
                this.chaine.anims.play('animChaine', true);
            }
        }

        if ((Phaser.Input.Keyboard.JustDown(this.keyT)|| this.controller.B) && this.cdGrappin == false && this.stepArme > 1) { // lancer de faux
            this.cdGrappin = true;
            this.time.delayedCall(700, function () {
                this.cdGrappin = false;
            }, [], this);
            this.faux.enableBody(true, true);
            this.faux.x = this.player.x;
            this.faux.y = this.player.y;
            this.poids.x = this.player.x;
            this.poids.y = this.player.y;
            this.chaine.x = this.player.x;
            this.chaine.y = this.player.y;
            this.faux.visible = true;
            this.chaine.visible = true;
            this.checkGrappinUsed = true;



            if (this.directionPlayer == 'right') {
                this.faux.angle = 0;
                this.chaine.angle = 0;
                this.faux.setVelocityX(this.speedPoids);
                this.faux.setVelocityY(0);
                this.chaine.anims.play('animChaine', true);

            }
            if (this.directionPlayer == 'left') {
                this.faux.angle = 180;
                this.chaine.angle = 180;
                this.faux.setVelocityX(-this.speedPoids);
                this.faux.setVelocityY(0);
                this.chaine.anims.play('animChaine', true);

            }
            if (this.directionPlayer == 'up') {
                this.faux.angle = -90;
                this.chaine.angle = -90;
                this.faux.setVelocityX(0);
                this.faux.setVelocityY(-this.speedPoids);
                this.chaine.anims.play('animChaine', true);
            }
            if (this.directionPlayer == 'down') {
                this.faux.angle = 90;
                this.chaine.angle = 90;
                this.faux.setVelocityX(0);
                this.faux.setVelocityY(this.speedPoids);
                this.chaine.anims.play('animChaine', true);

            }
        }

        if (this.poids.body.velocity.x == 0 && this.poids.body.velocity.y == 0 && this.faux.body.velocity.x == 0 && this.faux.body.velocity.y == 0) {
            this.poids.disableBody(true, true);
            this.faux.disableBody(true, true);
            this.chaine.visible = false;
            this.checkGrappinUsed = false;
            this.atkFauxCAC = false;
        }


        if (this.checkDistance(this.player.x, this.player.y, this.poids.x, this.poids.y) >= this.longueurChaine) { // longueur max de la chaine
            this.poids.setVelocity(0);
            this.poids.visible = false;
            this.chaine.visible = false;
            this.chaine.stop();
            this.chaine.visible = false;
        }

        if (this.checkDistance(this.player.x, this.player.y, this.faux.x, this.faux.y) >= this.longueurChaine || this.atkCAC == true) { // longueur max de la chaine
            this.faux.setVelocity(0);
            this.faux.visible = false;
            this.chaine.stop();
            this.chaine.visible = false;
            this.atkCAC = false;
        }



        /*this.physics.add.overlap(this.poids, this.blocCible, function () { // collision poids et bloc cible
            this.jumpGrappin = true;
            //this.player.x = this.blocCible.x;
            //this.player.y -= 1
            //this.player.y = this.blocCible.y;
            this.poids.setVelocity(0);
            this.chaine.stop();
            this.poids.visible = false;
            this.chaine.visible = false;
        }, null, this);*/

        /*if (this.jumpGrappin == true) {
            if (this.directionPlayer == 'up') {
                if (this.player.y > this.blocCible.y) {
                    this.player.y -= 6
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'down') {
                if (this.player.y < this.blocCible.y) {
                    this.player.y += 6
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'right') {
                if (this.player.x < this.blocCible.x) {
                    this.player.x += 6
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'left') {
                if (this.player.x > this.blocCible.x) {
                    this.player.x -= 6
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else {
                this.jumpGrappin = false;
            }
        }*/

        if (this.player.x > 592 && this.player.y > 760) { // Vers le niveau 1
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('niveau1', { entrance: "niveau2", priere: this.priere, lifePlayer: this.lifePlayer, longueurChaine: this.longueurChaine, stepArme:this.stepArme, nbMaillons:this.nbMaillons})
            })
        }

    }


    checkDistance(x1, y1, x2, y2) { // mesure la distance entre deux éléments
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    checkAngle2(x1, y1, x2, y2) {  // x1,y1 : mob, x2,y2 : player
        //console.log ((Math.atan2(y2-y1,x2-x1)*180)/Math.PI); //+360)%360)) //SENS HORAIRE en partant de la droite
        return ((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI); // +360 % 360 si on veut passer tout en degré
    }

    dropCoeur(x1, y1) {
        if ((Math.random()) < 0.05) { // 5% de taux de drop dans la forêt de bambous
            this.coeur.create(x1, y1, 'coeur');
        }
    }

    useGrappin(x1, y1) {
        // if (overlap grappin et objet grappinable)
        if (this.checkGrappin2 == true) {
            if (this.directionPlayer == 'up') {

            }
            this.player.setVelocityX(x1);
            this.player.setVelocityY(y1);
        }
        this.grappin.visible = false;
        this.checkGrappin2 = false;
        this.checkGrappinUsed = false;
    }

    useGrappin2() {
        this.poids.setVelocity(0);
    }

    checkGrappin() {
        this.checkGrappin2 = true;
    }

    coupeBambou(faux, bambou) {
        if (this.atkFauxCAC == true) {
            bambou.disableBody(true, true);
            this.dropCoeur(bambou.x, bambou.y)
        }
        else {
            this.faux.setVelocity(0);
        }
    }

    recupMaillon(player, maillon) { // nécessite X maillons pour arriver à 147 et Y maillons pour le max de 211
        if (this.longueurChaine <= 191) {
            this.longueurChaine += 20
        }
        else {
            this.longueurChaine = 211
        }
        maillon.disableBody(true, true);
    }

    recupCoeur(player, coeur) {
        if (this.lifePlayer < 7) {
            this.lifePlayer += 1;
            coeur.disableBody(true, true);
            switch (this.lifePlayer) {
                case 7:
                    this.lifeBarre.anims.play('life7', true);
                    break;
                case 6:
                    this.lifeBarre.anims.play('life6', true);
                    break;
                case 5:
                    this.lifeBarre.anims.play('life5', true);
                    break;
                case 4:
                    this.lifeBarre.anims.play('life4', true);
                    break;
                case 3:
                    this.lifeBarre.anims.play('life3', true);
                    break;
                case 2:
                    this.lifeBarre.anims.play('life2', true);
                    break;
                case 1:
                    this.lifeBarre.anims.play('life1', true);
                    break;
                case 0:
                    this.lifeBarre.anims.play('life0', true);
                    break;
            }
        }
    }
}
