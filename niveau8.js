export class niveau8 extends Phaser.Scene {
    constructor() {
        super("niveau8");
        this.platforms; // déclaration de toutes les variables utiles
        //this.player;
        this.cursors;
        this.gameOver = false;
        this.speed = 150;
        this.invulnerable = false;
        this.directionPlayer = 'down';
        this.cdCAC = false;
        this.atkCAC = false;
        this.atkFauxCAC = false;
        this.stunPlayer = false;
       

        // faux + poids


        this.checkGrappinUsed = false;
        this.cdGrappin = false;
        this.speedPoids = 300;
        this.jumpGrappin = false;
        this.checkJump = false;
        this.longueurChaine = 60 //211 max (131 pour passer la rivière)
        // on commence à 60 ?
        this.nbMaillons = 0;

        this.temp3 = 0;
        this.varTest = 0;
        this.cdClignotement = 4;
        /*this.prevX;
        this.prevY;*/

        this.keyboard;
        this.keyF;
        this.keyT;
        this.keyR;
        this.keyA;
        this.keyE;
        this.keyZ;
        this.keyQ;
        this.keyS;
        this.keyD;

        // Variable du mob
        this.spawn_mob = false;
        this.mobX = true;
        this.temp = false;
        this.speedMob = 70;
        this.visionRange = 170;
        this.angleMob = 0; // sa direction, pas défaut à droite, (gauche : Math.PI, haut : Math.PI/2, bas : -Math.PI/2)
        this.fovMob = Math.PI / 2 // son champ de vision, 90 degrés ici

    }

    init(data) {
        this.entrance = data.entrance;
        if (this.entrance == "niveau7")
            this.cameras.main.fadeIn(600, 0, 0, 0); // durée du degradé, puis valeur RVB
        else {
            this.cameras.main.fadeIn(1400, 0, 0, 0);
        }
        this.priere = data.priere;
        this.lifePlayer = data.lifePlayer;
        this.longueurChaine = data.longueurChaine
        this.nbMaillons = data.nbMaillons
        //variables pour lignes de dialogues comme la prière
    }


    preload() { // préchargement des assets
        this.load.image('mob', 'assets/bomb.png')
        this.load.image('drop', 'assets/drop.png');
        this.load.image('caisse', 'assets/caisse.png')
        this.load.image('blocCible', 'assets/blocCible.png');
        this.load.image('poids', 'assets/poids.png');
        this.load.spritesheet('lifeBarre', 'assets/lifeBarre.png',
            { frameWidth: 32 * 7, frameHeight: 64 });
        this.load.image('faux', 'assets/faux.png');
        this.load.spritesheet('chaine', 'assets/chaine.png',
            { frameWidth: 32 * 7, frameHeight: 32 });
        this.load.spritesheet('animStun', 'assets/animStun.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.image('coeur', 'assets/coeur.png');
        this.load.image('tileset1', 'tiled/tilesetZelda.png'); //import du tileset
        this.load.tilemapTiledJSON('niveau8', 'tiled/level8_zelda.json'); // import fichier tiled
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 48 }
        )
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
        this.load.spritesheet('marcheBossGauche', 'assets/samurai2_marche_gauche.png',
        { frameWidth: 20, frameHeight: 32 }
        )
        this.load.spritesheet('marcheBossDroite', 'assets/samurai2_marche_droite.png',
        { frameWidth: 20, frameHeight: 32 }
    )

    };

    create() { // Création des éléments dès l'initialisation du jeu


        this.map1 = this.add.tilemap('niveau8');
        this.tileset = this.map1.addTilesetImage('tilesetZelda', 'tileset1');
        this.checkJump = false;

        // Import de tous les calques

        this.calque_sol = this.map1.createLayer('Sol', this.tileset);
        this.calque_escaliers = this.map1.createLayer('Escaliers',this.tileset);
        this.calque_caisse = this.map1.getObjectLayer('Caisse');
        this.calque_murs = this.map1.createLayer('Murs', this.tileset);
        this.calque_murs.setCollisionByProperty({ isSolid: true });
        this.calque_sol.setCollisionByProperty({ isSolid: true });
        this.calque_blocs_cibles = this.map1.getObjectLayer('blocs_cible');


        this.cursors = this.input.keyboard.createCursorKeys(); // variable pour input

        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        this.controller = false;
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        })


        this.coeur = this.physics.add.staticGroup();


        this.blocsCible = this.physics.add.staticGroup();
        this.calque_blocs_cibles.objects.forEach(eachBlocs => {
            this.blocCible = this.blocsCible.create(eachBlocs.x + 16, eachBlocs.y - 16, 'blocCible');
            this.blocCible.visible = false;
        })


        // SPAWN

        if (this.entrance == 'niveau7') {
            this.player = this.physics.add.sprite(17*32, 6*32, 'ninja');
            this.spawn_mob = false;
        }
        else {
            this.player = this.physics.add.sprite(17*32, 6*32, 'ninja'); 
            this.lifePlayer = 7;
            this.spawn_mob = false;
            this.longueurChaine = 211;
            
        }
        this.player.setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(14,28).setOffset(2,3); // modification de la hitbox
        this.physics.add.collider(this.player, this.calque_murs);
        this.physics.add.collider(this.player, this.calque_sol);



        

        this.caisses = this.physics.add.group({ collideWorldBounds: true });
        this.calque_caisse.objects.forEach(eachCaisses => {
            this.caisse = this.caisses.create(eachCaisses.x + 16, eachCaisses.y - 16, 'caisse');
        })
        this.physics.add.collider(this.player, this.caisses, this.pousseCaisse, null, this);
        this.physics.add.collider(this.calque_murs, this.caisses);
        this.physics.add.collider(this.calque_sol, this.caisses);
        this.physics.add.collider(this.caisses, this.caisses);



        this.chaine = this.physics.add.sprite(0, 0, 'chaine');
        this.chaine.setOrigin(0, 0.5);


        this.mobs = this.physics.add.group({ collideWorldBounds: true });
        this.mobs.setOrigin(0.5, 0.5);
        this.physics.add.collider(this.mobs, this.player);
        this.physics.add.collider(this.mobs, this.calque_murs);
        this.physics.add.collider(this.mobs, this.calque_sol);
        this.physics.add.collider(this.mobs, this.mobs);
        this.physics.add.collider(this.mobs, this.bambous);
        this.physics.add.collider(this.mobs, this.caisses);


        this.animStun = this.physics.add.sprite(0, 0, 'animStun');
        this.animStun.visible = false;
        this.animStun.setOrigin(0, 0.5);


        this.poids = this.physics.add.sprite(0, 0, 'poids');
        this.poids.setCollideWorldBounds(true);
        this.poids.setOrigin(0.5, 0.5);
        this.physics.add.collider(this.poids, this.calque_murs);


        this.faux = this.physics.add.sprite(0, 0, 'faux');
        this.faux.setCollideWorldBounds(true);
        this.faux.setOrigin(0.5, 0.5);
        this.physics.add.collider(this.faux, this.calque_murs);

        this.physics.add.overlap(this.faux, this.caisses, this.ouvreCaisse, null, this);
        this.physics.add.collider(this.poids, this.caisses, this.pousseCaisse, null, this);

        this.mentor = this.physics.add.staticSprite(820, 1276, 'mentor');
        this.physics.add.collider(this.player, this.mentor);



        this.physics.world.setBounds(0, 0, 640, 352); // Défini les limites où le joueur peut aller
        this.cameras.main.setBounds(0, 0, 640, 352); // Défini les limites de la caméra (début x, début y, fin x, fin y)
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); //ancrage de la caméra sur l'objet player
        this.cameras.main.setZoom(4);

        this.calque_Au_Dessus = this.map1.createLayer('Au_dessus', this.tileset);

        this.lifeBarre = this.physics.add.sprite(720, 415, 'lifeBarre'); // le sprite s'affiche 
        this.lifeBarre.setScrollFactor(0);
        this.lifeBarre.setOrigin(0, 0);
        this.lifeBarre.fixedToCamera = true;

        this.anims.create({
            key: 'animChaine',
            frames: this.anims.generateFrameNumbers('chaine', { start: 0, end: 13 }),
            repeat: 0,
            frameRate: this.speedPoids / 15, // syncro à revoir avec vitesse poids/faux
        });

        this.anims.create({
            key: 'animationStun',
            frames: this.anims.generateFrameNumbers('animStun', { start: 0, end: 2 }),
            repeat: -1,
            frameRate: 5,
        });

        this.anims.create({
            key: 'bossDroite',
            frames: this.anims.generateFrameNumbers('marcheBossDroite', { start: 0, end: 7 }),
            repeat: -1,
            frameRate: 13,
        });
        this.anims.create({
            key: 'bossGauche',
            frames: this.anims.generateFrameNumbers('marcheBossGauche', { start: 0, end: 7 }),
            repeat: -1,
            frameRate: 13,
        });

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

        if (this.entrance == 'niveau7') {
            this.directionPlayer = 'left';
        }
        else {
            this.directionPlayer = 'left';
        }



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
        //if (this.gameOver) { return; } // ça freeze le jeu
        if (this.lifePlayer <= 0) {
            this.lifePlayer = 6;
            //this.gameOver = true;
            this.scene.start('niveau8', { entrance: 'niveau8', lifePlayer : this.lifePlayer }) // reset
        }
        else if (this.lifePlayer > 7){
            this.lifePlayer = 7;
        }

        this.caisses.children.each(function (caisse) {
            if (caisse.body.velocity.x > 0 || caisse.body.velocity.y > 0) {
                this.time.delayedCall(200, () => {
                    caisse.setVelocity(0);
                });
            }
        });



        // Spawn des ennemis
        if (this.spawn_mob == false) {
            this.spawn_mobs();
        }



        // COMPORTEMENT MOB
        if (this.spawn_mob == true) {
            this.mobs.children.each(function (mob) {
                if (mob.dead == false) { // Si mob est vivant

                    // attribution de sa direction selon sa vitesse x et y
                    if (mob.body.velocity.x > 0) {
                        mob.direction = 'right'
                        mob.anims.play('bossDroite', true);
                        /*if (Math.abs(mob.body.velocity.x) > Math.abs(mob.body.velocity.y)) {
                            //droite
                            mob.direction = 'right'
                            mob.anims.play('mobDroite', true);
                        }*/
                        /*else if (mob.body.velocity.y >= 0) {
                            // bas
                            mob.direction = 'down'
                        }
                        else if (mob.body.velocity.y < 0) {
                            //haut
                            mob.direction = 'up'
                        }*/
                    }
                    else if (mob.body.velocity.x < 0) {
                        mob.direction = 'left'
                        mob.anims.play('bossGauche', true);
                        /*if (Math.abs(mob.body.velocity.x) > Math.abs(mob.body.velocity.y)) {
                            //gauche
                            mob.direction = 'left'
                            mob.anims.play('mobGauche', true);
                        }*/
                        /*else if (mob.body.velocity.y >= 0) {
                            // bas
                            mob.direction = 'down'
                        }
                        else if (mob.body.velocity.y < 0) {
                            //haut
                            mob.direction = 'up'
                        }*/
                    }
                    /*else if (mob.body.velocity.x == 0){
                        mob.anims.stop();
                    }*/


                    // champ de vision selon sa direction
                    if (mob.direction == 'right') {
                        mob.angleVision = 0; // variable pas utile
                        this.borneMin = -45;
                        this.borneMax = 45;
                    }
                    else if (mob.direction == 'left') {
                        mob.angleVision = 180;
                        this.borneMin = 135; // entre -180 et -135
                        this.borneMax = -135; // entre 135 et 180
                    }
                    else if (mob.direction == 'up') {
                        mob.angleVision = -90;
                        this.borneMin = -135;
                        this.borneMax = -45;
                    }
                    else if (mob.direction == 'down') {
                        mob.angleVision = 90;
                        this.borneMin = 45;
                        this.borneMax = 135;
                    }


                    if (mob.stun == false) {
                        if (mob.modeAggro == true) { // MODE POURCHASSE & ATTAQUE
                            // arrêt du pattern de patrouille immédiat
                            this.tweens.killTweensOf(mob); // arret  de l'animation en cours

                            if (this.checkDistance(this.player.x, this.player.y, mob.x, mob.y) > 50) { // Si mob est assez proche, il s'arrete
                                this.physics.moveToObject(mob, this.player, 90)
                                mob.modeATK = false;
                            }
                            else {
                                mob.setVelocity(0)
                                mob.modeATK = true;
                            }
                            if (mob.modeATK == true) {
                                if (mob.cdATK == false) {
                                    mob.cdATK = true;
                                    //this.time.delayedCall(3000, this.attaqueMob(mob, mob.x, mob.y), [], this); // attaque au bout de 1,5 sec au CAC
                                    this.time.delayedCall(1400, () => { // attaque au bout de 1,5 sec au CAC
                                        this.attaqueMob(mob, mob.x, mob.y, mob.dead)
                                    });
                                }
                            }
                        }
                        else { // MODE PATROUILLE
                            //console.log(mob.direction);
                            if (this.checkDistance(mob.x, mob.y, this.player.x, this.player.y) < 2) { // si le joueur est trop près, le mob le détecte
                                mob.modeAggro = true;
                            }
                            else if (this.checkDistance(mob.x, mob.y, this.player.x, this.player.y) < this.visionRange) { // si le joueur est trop près, le mob le détecte
                                if ((this.checkAngle2(mob.x, mob.y, this.player.x, this.player.y) <= this.borneMax) &&
                                    ((this.checkAngle2(mob.x, mob.y, this.player.x, this.player.y)) >= this.borneMin)) {
                                    mob.modeAggro = true;
                                }
                            }
                        }

                    }
                    else {
                        this.animStun.enableBody(true, true);
                        this.animStun.visible = true;
                        this.animStun.x = mob.x - 16;
                        this.animStun.y = mob.y - 16;
                        this.animStun.anims.play('animationStun', true);
                        mob.modeATK = false;
                    }
                }
            }, this)
        }




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
        if (Phaser.Input.Keyboard.JustDown(this.keyT)) {
            console.log(this.longueurChaine)
            console.log(this.varTest)
            console.log(this.player.x)
            console.log(this.player.y)
            //this.player.setTint();
        }


        // ATTAQUE AU CAC


        if ((Phaser.Input.Keyboard.JustDown(this.keyF) || this.controller.X) && this.cdGrappin == false) { // Attaque au CAC
            this.cdGrappin = true;
            this.atkFauxCAC = true;
            this.time.delayedCall(800, function () { // Cooldown avant de pouvoir retaper
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

        if ((Phaser.Input.Keyboard.JustDown(this.keyR) || this.controller.Y) && this.cdGrappin == false) { // lancer de poids / grappin
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

        if ((Phaser.Input.Keyboard.JustDown(this.keyA) || this.controller.B) && this.cdGrappin == false) { // lancer de faux
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
                //this.useGrappin2(200,0);
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



        this.physics.add.overlap(this.poids, this.blocsCible, this.jump, null, this) // collision poids et bloc cible = grappin







        if (this.player.x > (19*32) ) { // Vers le niveau 7
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('niveau7', { entrance: 'niveau8', lifePlayer:this.lifePlayer})
            })
        }


        this.physics.add.overlap(this.player, this.coeur, this.recupCoeur, null, this)  // ramassage maillon



    }






    // FONCTIONS


    checkDistance(x1, y1, x2, y2) { // mesure la distance entre deux éléments
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    checkAngle2(x1, y1, x2, y2) {  // x1,y1 : mob, x2,y2 : player
        //console.log ((Math.atan2(y2-y1,x2-x1)*180)/Math.PI); //+360)%360)) //SENS HORAIRE en partant de la droite
        return ((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI); // +360 % 360 si on veut passer tout en degré
    }

    dropCoeur(x1, y1) {
        if ((Math.random()) < 0.8) { // 20% de taux de drop
            this.coeur.create(x1, y1, 'coeur');
        }
    }



    attaqueMob(mob, mobx, moby, mobDead) {
        mob.cdATK = false;
        if (mobDead == false) {
            if (this.checkDistance(this.player.x, this.player.y, mobx, moby) <= 50) {
                if (!this.invulnerable) {
                    this.lifePlayer -= 2;
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
                    this.invulnerable = true;
                    this.cdClignotement = 4;
                    this.clignotementRouge1(this.player);
                    this.stunPlayer = true;
                    this.repoussement(mob, this.player);
                    this.cameras.main.shake(50, 0.005, false, null); // durée, intensité
                    this.time.delayedCall(1500, () => {
                        this.invulnerable = false;
                    });
                    this.time.delayedCall(600, () => {
                        this.stunPlayer = false;
                    });
                }
            }
        }

    }

    clignotementRouge1(objet) {
        objet.setTint(0xff0000);
        this.time.delayedCall(300, () => {
            this.clignotementRouge2(objet);
        });
    }

    clignotementRouge2(objet) {
        if (this.cdClignotement > 0) {
            this.cdClignotement -= 1;
            objet.setTint();
            this.time.delayedCall(300, () => {
                this.clignotementRouge1(objet);
            });
        }
        else {
            objet.setTint();
        }
    }
    repoussement(objetQuiTape, cible) {

        cible.setVelocityX((cible.x - objetQuiTape.x) * 8);
        cible.setVelocityY((cible.y - objetQuiTape.y) * 8);
        this.time.delayedCall(200, () => {
            cible.setVelocity(0);
        });
    }

    

    pousseCaisse(poids, caisse) {

        caisse.setVelocityX((caisse.x - poids.x) * 5);
        caisse.setVelocityY((caisse.y - poids.y) * 5);
        this.time.delayedCall(200, () => {
            caisse.setVelocity(0);
        });
        this.poids.setVelocity(0);

    }
    ouvreCaisse(faux, caisse) {
        if (this.atkFauxCAC == true) {
            caisse.disableBody(true, true);
            this.dropCoeur(caisse.x, caisse.y)
        }
        else {
            this.faux.setVelocity(0)
        }
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
   jump(poids, blocCible) {

        this.poids.setVelocity(0);
        this.poids.disableBody(true, true);
        this.chaine.stop();
        this.poids.visible = false;
        this.chaine.visible = false;
        this.jumpGrappin = true;
        if (this.jumpGrappin == true) {

            if (this.directionPlayer == 'up') {
                if (this.player.y > blocCible.y) {
                    this.player.y -= 6
                    this.time.delayedCall(15, () => {
                        this.jump(poids, blocCible)
                    });
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'down') {
                if (this.player.y < blocCible.y) {
                    this.player.y += 6
                    this.time.delayedCall(15, () => {
                        this.jump(poids, blocCible)
                    });
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'right') {
                if (this.player.x < blocCible.x) {
                    this.player.x += 6
                    this.time.delayedCall(15, () => {
                        this.jump(poids, blocCible)
                    });
                    //this.jump(poids,blocCible)
                }
                else {
                    this.jumpGrappin = false;
                }
            }
            else if (this.directionPlayer == 'left') {
                if (this.player.x > blocCible.x) {
                    this.player.x -= 6
                    this.time.delayedCall(15, () => {
                        this.jump(poids, blocCible)
                    });
                }
                else {
                    this.jumpGrappin = false;
                }
            }
        }
    }

    droite(mob, mobAggro) {
        if (mobAggro == false) {
            mob.setVelocityX(1);
            this.droite1 = this.tweens.add({
                targets: mob,
                x: mob.x + 96, // destination
                duration: 1500, // durée pour se rendre à destination
                hold: Phaser.Math.Between(700, 3000), // temps d'attente après être arrivé
                onComplete: function () { // on lance le retour après le temps d'attente
                    if (mobAggro == false) {
                        this.gauche(mob, mobAggro)
                    }
                }.bind(this)
            });
        }
    }

    gauche(mob, mobAggro) { //pattern gauche
        if (mobAggro == false) {
            mob.setVelocityX(-1);
            this.gauche1 = this.tweens.add({
                targets: mob,
                x: mob.x - 96,
                duration: 1500,
                hold: Phaser.Math.Between(700, 3000),
                onComplete: function () {
                    if (mobAggro == false) {
                        this.droite(mob, mobAggro)
                    }
                }.bind(this)
            });
        }
    }

    haut(mob, mobAggro) {
        if (mobAggro == false) {
            mob.setVelocityY(-1);
            this.haut1 = this.tweens.add({
                targets: mob,
                y: mob.y - 96, // destination
                duration: 1500, // durée pour se rendre à destination
                hold: Phaser.Math.Between(700, 3000), // temps d'attente après être arrivé
                onComplete: function () { // on lance le retour après le temps d'attente
                    if (mobAggro == false) {
                        this.bas(mob, mobAggro)
                    }
                }.bind(this)
            });
        }
    }

    bas(mob, mobAggro) { //pattern bas
        if (mobAggro == false) {
            mob.setVelocityY(1);
            this.bas1 = this.tweens.add({
                targets: mob,
                y: mob.y + 60,
                duration: 1500,
                hold: Phaser.Math.Between(700, 3000),
                onComplete: function () {
                    if (mobAggro == false) {
                        this.haut(mob, mobAggro)
                    }
                }.bind(this)
            });
        }
    }


    spawn_mobs() {
        this.spawn_mob = true;

        this.mobs.create(7*32, 6*32, 'marcheBossgauche').anims.play('bossGauche', true);


        this.mobs.children.each(function (mob) {
            mob.hp = 15;
            mob.can_get_hit = true;
            mob.stun = false;
            mob.modeAggro = false;
            mob.modeATK = false;
            mob.cdATK = false;
            mob.dead = false;
            mob.direction = 'down';
            mob.angleVision = 0;
            mob.setSize(12,28);



            this.gauche(mob, mob.modeAggro, mob.direction);

            /*this.tweens.add({
                targets: mob,
                y: mob.y - 60, // Aller à une position de 100 pixels plus haut
                duration: 2000, // Pendant une durée de 1 seconde
                repeat: -1, // Répéter en boucle
                yoyo: true, // Revenir à la position initiale après l'animation
                hold: 3000
            });*/

            this.physics.add.overlap(mob, this.poids, function (mob) { // collision poids et mob
                this.poids.setVelocity(0);
                this.chaine.stop();
                this.poids.visible = false;
                this.chaine.visible = false;
                mob.modeAggro = true;
                mob.stun = true;
                this.time.delayedCall(800, () => { // durée du stun
                    mob.stun = false;
                    this.animStun.visible = false;
                    //this.animStun.disableBody(true,true);
                });
                this.repoussement(this.poids, mob)
            }, null, this);



            this.physics.add.overlap(mob, this.faux, function (mob) { // collision faux et mob

                mob.modeAggro = true;
                this.chaine.stop();
                this.chaine.visible = false;
                if (this.atkFauxCAC == false){
                    this.faux.setVelocity(0);
                }
                if (mob.can_get_hit == true) {
                    mob.can_get_hit = false;
                    if (mob.stun == true) { // dégâts doublés si mob stun
                        mob.hp -= 2
                    }
                    else {
                        mob.hp -= 1;
                    }
                    this.cdClignotement = 4;
                    this.repoussement(this.faux, mob);
                    this.time.delayedCall(1500, () => {
                        mob.can_get_hit = true;
                    });
                    // mob repoussé
                    this.clignotementRouge1(mob);

                }

                if (mob.hp <= 0) {

                    if (mob.dead == false) {
                        mob.dead = true;
                        mob.body.setVelocity(0);
                        this.dropCoeur(mob.x, mob.y);
                        mob.disableBody(true, true);
                        //mob.destroy();
                        this.time.delayedCall(2000, () => { // à voir pour une animation de mort
                            mob.destroy();
                            this.scene.start('sceneFin')

                
                        })
                    }
                }
            }, null, this);
        }, this)

    };
}