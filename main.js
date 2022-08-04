var configuration = {
    type: Phaser.AUTO,
    pixelArt : true,
    width : 3000,
    height : 1780,
    // backgroundColor : '#353535',
    backgroundColor : '#FFFFFF',
    fps: {
        target: 50,
        forceSetTimeOut: true
      },
    input : {
        gamepad : true
    },
    scale:{
       mode : Phaser.Scale.FIT,
       autoCenter: true,
    //    width : 720,
    //    height : 420,
    },
    scene:{
        preload : preload,
        create : create,
        update : update
    },
    physics :{
        default : 'arcade',
        arcade :{
                    debug : false,
                    tileBias : 36,
                    gravity : {y : 1000},
                }
    },
}

var game = new Phaser.Game(configuration);

//var touchesClavier; //touches de direction
var leftkey;
var rightkey;
var upkey;
var touchesAttack; // touche d'attaque    


///Provisoire
var theGamePad;
var gamepadJump; // : boolean
var gamepadAttack; // : boolean
/////////////////////////////////
var gamePadCombo;

var player;
var playerVelocityX;
var playerInGround; // : boolean
var counterMovePlayer; // compteur combo attack : number
var playerFlip; // direction du joueur : boulean
var PlayerTouchEnemy; // : boolean
var colideATK1; // collision attaque 1 : sprite
var colideATK2; // collision attaque 1 : sprite
var attackintheair; // verifie si attaque en l'air : boolean
var attackinground;
var playerCanFall; // : boolean


var enemy1Spawn; //spawn enemy
var enemyCrossBowSpawn;
var boxSpawn;


var enemyNumberId;
var colideATK;

var box;    // caisse en bois : sprite

var skyBg; //ciel
var Coin;  //pieces
var Arrow;
var text;  // info command list
var Score = 0; // Score
var scoreText;
var healthBar; 

var spawnDetector;
var spawnReActivator;
var spawnCounter = 0;

var countTest = 0;


var currentEnemy;

function preload(){
    this.load.image('sky','assets/Thesky.png');
    this.load.image('ground','assets/solPave.png');
    this.load.image('ATK1','assets/TRlogo.png');
    this.load.image('spawner','assets/ROELprod.png');
    this.load.image('carreau', 'assets/carreau.png');
    
    this.load.image('forest', 'assets/levelOne/Decor2.png');
    this.load.tilemapTiledJSON('tiles', 'assets/levelOne/forest.json')

    this.load.spritesheet('slash','assets/Slash.png', {frameWidth : 65, frameHeight : 65});
    this.load.spritesheet('slashGuard','assets/SlashGuard.png', {frameWidth : 8, frameHeight : 23});
    this.load.spritesheet('piecette','assets/Coin.png', {frameWidth : 8, frameHeight : 8});
    this.load.spritesheet('hero', 'assets/Sprites/stancearmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroAttack', 'assets/Sprites/sword_attack_move.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herorun', 'assets/Sprites/walkarmed_old.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojump', 'assets/Sprites/jumparmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojumpAtk', 'assets/Sprites/jump_sword_attack.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroGuard', 'assets/Sprites/guard.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroProtectGuard', 'assets/Sprites/Playerkbtest.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroKnockBack', 'assets/Sprites/KnockBack.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('shoryu', 'assets/Sprites/shoryu.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('pushBox', 'assets/Sprites/pousse.png',{frameWidth: 170, frameHeight: 170});
    //this.load.spritesheet('carreau', 'assets/carreau.png',{frameWidth: 20, frameHeight: 4});

    // this.load.spritesheet('powerSlash', 'assets/PowerSlash.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('box', 'assets/box.png',{frameWidth: 62, frameHeight: 62});
    this.load.spritesheet('theEnemy', 'assets/Enemy/enemiaxe.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyfall', 'assets/Enemy/enemi1falling.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyCrossBow', 'assets/Enemy/arbaletrier.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyPoleAxe', 'assets/Enemy/poleaxegiant.png',{frameWidth: 180, frameHeight: 170});

}

/////////////////////////////////////////////////////////////////////////////////////       CREATE
function create(){

    /// SET VARIABLE    
    attackintheair = false;
    counterMovePlayer = 0;
    playerVelocityX = 270;
    playerInGround = false;
    PlayerTouchEnemy = false;
    attackinground = false;
    playerCanFall = true;
    gamePadCombo = [];
    enemyNumberId = 0;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
   /// OBJECT

    skyBg = this.add.tileSprite(0, 0, 404, 482, 'sky').setScale(2); //image ciel

    ////////////////////////////////////////////////////////////////////

    // LEVEL

    const map = this.make.tilemap({ key : 'tiles'})                                                    // TILED level
    const tileset = map.addTilesetImage('map','forest');

    const Spawner = map.createLayer('Spawners', tileset, -200, 0)
    const BackGround = map.createLayer('Fond', tileset, -200, 0)
    const newPlatform = map.createLayer('Ground', tileset, -200, 0)
    const CrossPlatform = map.createLayer('CrossGround', tileset, -200, 0)
    const Decor = map.createLayer('Decors', tileset, -200, 0)
    
    Spawner.setCollisionByProperty({collides : true})
    newPlatform.setCollisionByProperty({collides : true})
    CrossPlatform.setCollisionByProperty({collides : true})

    Spawner.setScale(2);
    BackGround.setScale(2);
    newPlatform.setScale(2);
    CrossPlatform.setScale(2);
    Decor.setScale(2)
    Decor.setDepth(1);

    Spawner.setData('Activate', false);
    // Fond.setScale(1.5)

    // console.log(CrossPlatform);


    ////////////////////////////////////////////////////////////////////

    // var sol1 = this.add.sprite(300, 400, 'ground');//image sol
    // var sol2 = this.add.sprite(511, 550, 'ground');//image sol
    // var sol3 = this.add.sprite(900, 600, 'ground');//image sol


    enemy1Spawn = this.add.image(1000, 1100, 'spawner').setVisible(false);         //spawn enemy
    enemyCrossBowSpawn = this.add.image(700, 300, 'spawner').setVisible(false);  //spawn enemy
    boxSpawn = this.add.group({
        key : 'box',
        visible : false,
    });            //spawn enemy

    
    healthBar = this.add.rectangle(0,0,100,10,0xB14F37).setStrokeStyle(2, 0xFFFFFF); //healthbar
    
    Coin = this.physics.add.group({                                                 // Coin
        //key :'piecette',
        setXY:{x: -400, y :30},
        visible : false,
    });

    colideATKEnemy = this.physics.add.group({allowGravity : false})                 // collide attack enemies

    Arrow = this.physics.add.group({allowGravity : false})                          // Arrow 

    hittableObject = this.physics.add.group()                                       // enemy and other...

    // box = this.physics.add.group({                                                  // woodBox
    //     key : 'box',
    //     name : 'woodBox',
    //     //allowGravity : false,
    //     repeat : 2,
    //     setXY:{x: -100, y :90, stepX: 800},
    //     setScale : {x : 3},
    // });
    // box.children.iterateLocal('setData', 'pv', 4)
    // box.children.iterateLocal('setSize', 35,35)
    // box.setVelocityY(600)
    
    player = this.physics.add.sprite(600, 1150,'hero').setScale(2);                  // player
    player.body.setSize(25, 58)                                         
    player.setData('health', 10)
    player.setData('Guard', false)
    player.setData('Eject', false)
    player.body.checkCollision.up = false;
    //console.log(player.body);

    // colideATK2 = this.physics.add.group({                                           // collision attack
    //     key : 'ATK1',
    //     allowGravity : false,
    //     // disableBody : true,
    //     // visible : false,
    //     //data : {'Eject': false},
    //     //size : {x : 20, y : 20},
    //     setXY : {x : 1199, y :1199}
    // })

    colideATK = this.add.rectangle(0,0,50,50,0xB14F37)                         // collision attack final
    this.physics.add.existing(colideATK);
    colideATK.setVisible(false)
    colideATK.body.allowGravity = false;

    slashAtk = this.add.sprite(0,0,'slash').setScale(2);                            // img Slash
    slashAtk.setDepth(1);

    spawnDetector = this.add.rectangle(900,1000,50,400,0xB14F37);
    this.physics.add.existing(spawnDetector);
    //spawnDetector.setData('Active', false)
    //spawnDetector.setVisible(false)
    spawnDetector.body.allowGravity = false;

    // spawnReActivator = this.add.rectangle(400,1000,50,400,0x3F88E8);
    // this.physics.add.existing(spawnReActivator);
    // //spawnDetector.setData('Active', false)
    // //spawnDetector.setVisible(false)
    // spawnReActivator.body.allowGravity = false;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // TEXT

    text = this.add.text(0,0, ' << CONTROL >> \n LEFT = press "Q"\n RIGHT = press "D"\n JUMP  = press "Z"\n ATTACK = press "J"\n GUARD = press "I" \n GAMEPAD : disconected\n version : O.11 | 3.08.22' , {fontFamily : 'PixelFont'}); 
    scoreText = this.add.text(0,0, 'SCORE : 0',{ fontFamily : 'PixelFont', color : '#353535'})
    text.setDepth(2);
    scoreText.setDepth(2);
    //text.setFontSize(text.fontSize - 2)
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // CAMERA

    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(4);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COLLISIONS

    // var platform = this.physics.add.staticGroup();// groupe plateforme
    //     platform.add(sol1)//asigne
    //     platform.add(sol2)//asigne
    //     platform.add(sol3)//asigne

        // this.physics.add.collider(platform,player, function( pl4yer,theplatform){ //collision entre la plateforrme et le joueur 
        //     if(theplatform.body.touching.up && pl4yer.body.touching.down){
        //         attackintheair = false;
        //         playerInGround = true;
        //     }
            // if(theplatform.body.touching.right || theplatform.body.touching.left){
            //     //console.log('ju');
            //     //playerVelocityX = 0
            // }
        // })
        //this.physics.add.collider(platform,box)                     //collision plateforme et boites

        // this.physics.add.collider(box,box, function(box2, box1){    // collisions entre boites
        //     box1.body.blocked.left = true
        //     box1.body.blocked.right = true
        //     box2.body.blocked.left = true
        //     box2.body.blocked.right = true
        //     //console.log(box1.body.blocked.left);
        // })
        this.physics.add.overlap(Coin, player, function(theplayer, piepiece){   // collision pieces et joueur 
            Score++;
            piepiece.destroy();
            //console.log('Score : '+Score);
            })

        this.physics.add.collider(player, Arrow, function(plyr,arrw){           // collision Fleches + joueur
            arrw.setY(-999)
            arrw.setX(0)
            arrw.setVelocityY(0)
            // console.log(plyr.data.list.Guard);
            if(plyr.data.list.Guard === true){
                counterMovePlayer = 14
            }else{
                if(plyr.body.touching.right){plyr.flipX = false};
                if(plyr.body.touching.left){plyr.flipX = true};
                counterMovePlayer = 28;
                plyr.data.list.health--;
            }
        })

        // this.physics.add.collider(box, player, function (theplayer, thebox){    //collision entre box et le joueur 
        //     thebox.setVelocityX(0)
        //     if(thebox.body.touching.up && theplayer.body.touching.down){
        //         playerInGround = true;
        //         thebox.setGravityY(-1)
        //     }
        // });

        // this.physics.add.collider(Coin, platform)
        this.physics.add.collider(Coin, newPlatform)

        this.physics.add.collider(player, newPlatform, function(plyr,pltfrm){       //collision player + platform tiles
            if(pltfrm.faceLeft && plyr.body.velocity.y != 0|| 
                pltfrm.faceRight && plyr.body.velocity.y != 0){
                    playerInGround = false;
                }
                else{
                attackintheair = false;
                playerInGround = true;
            }
        })

        this.physics.add.collider(player, CrossPlatform, function(plyr,pltfrm){       //collision player + CrossPlatform tiles
            // console.log(pltfrm);
            pltfrm.faceLeft = false;
            pltfrm.faceRight = false;
            pltfrm.faceBottom = false;

            attackintheair = false;
            playerInGround = true;
        })

        this.physics.add.collider(Spawner, spawnDetector, function(detector, spawn){
            
            console.log(spawn.pixelX);
            console.log(spawn.pixelY);
            // console.log(spawn.body.checkCollision.none);
            console.log('spawnCounter :' +spawnCounter);

            spawnCounter ++;

            detector.body.position.x = player.body.position.x +600
            detector.body.position.y = player.body.position.y -150

            //console.log(detector);
            detector.body.checkCollision.none = true
            setTimeout(()=>{detector.body.checkCollision.none = false},3000)
            switch(spawnCounter){
                case 1: createEnemies(detector,'Enemy1'); break;
                case 2: createEnemies(detector,'box'); break;
                case 3: createEnemies(detector,'Enemy1'); break;
                case 4: createEnemies(detector,'box'); break;
                case 5: createEnemies(detector,'CrossBow'); break;
                case 6: createEnemies(detector,'box'); break;
                case 7: createEnemies(detector,'Enemy1'); break;
                case 8: createEnemies(detector,'box'); break;
                case 9: createEnemies(detector,'PoleAxe'); break;
                case 10: spawnCounter = 0; break;

            }
            


        })

        // this.physics.add.collider(Spawner, spawnReActivator, function(spawn,detector){
        //     spawn.body.checkCollision.none = false;

        // })

        // this.physics.add.overlap(player,CrossPlatform, function(plyr,CrssPltfrm){       //collision platform + cross Platform tiles
        //     CrssPltfrm.faceLeft = false;
        //     CrssPltfrm.faceRight = false;
        //     CrssPltfrm.faceBottom = false;
        //     console.log(CrssPltfrm);
        // })


        // console.log(CrossPlatform.displayList.list.length);
        // console.log(CrossPlatform.displayList.list[0]);
        
        // for(var i = 0; i < CrossPlatform.displayList.list.length; i++){
        //     CrossPlatform.displayList.list[i].faceLeft = false;
        //     CrossPlatform.displayList.list[i].faceRight = false;
        //     CrossPlatform.displayList.list[i].faceBottom = false;
        //     console.log('fdp');
        // }



        // this.physics.add.overlap(colideATK2, box, function(colAtk2, boite){     // collision entre attaque et boites 
        //     boite.data.list.pv = boite.data.list.pv - 1;
        //     colAtk2.destroy()
            
        //     player.anims.pause();
        //     setTimeout(()=>{player.anims.resume()},200)

        //     createCoin(boite, Coin)

        //     if(boite.data.list.pv === 3){boite.anims.play('damageOne', true);}
        //     else if(boite.data.list.pv === 2){boite.anims.play('damageTwo', true);}
        //     else if(boite.data.list.pv <= 1){
        //         boite.anims.play('damageLast', true);
        //         boite.on('animationcomplete',()=>{
        //             for(var i = 0;i < 20;i++){ createCoin(boite)};
        //             boite.destroy();})
        //     }
        // })

        
        this.physics.add.collider(hittableObject, newPlatform, function(htblobjct, Platform){})   //collision Enemy + platform

        // this.physics.add.overlap(hittableObject, newPlatform, function(htblobjct, Platform){      //overlap Enemy + platform
        //     //htblobjct.body.velocity.y = -75
        //     //console.log('ho');
        // })
        
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    // ENTREES CLAVIER

    leftkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    rightkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    upkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    //touchesClavier = this.input.keyboard.addKeys('Q, Z, S, D'); //direction
    touchesAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); //attack
    touchesGuard = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Guard

    var tornadoSlashLeft = this.input.keyboard.createCombo([83, 68, 74], {resetOnMatch:true, maxKeyDelay:700}); //300ms pour taper le combo, sinon se reinitialise
    var tornadoSlashRight = this.input.keyboard.createCombo([83, 81, 74], {resetOnMatch:true, maxKeyDelay:700}); 

    this.input.keyboard.on('keycombomatch', function(combo){ //verification du secialAtk entré
        if((combo === tornadoSlashLeft || tornadoSlashRight )&& playerInGround === true && counterMovePlayer === 0){
            counterMovePlayer = 32;
            tornadoSlash();
        }
    }) 
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // GAMEPAD

    gamepadAttack = false;
    gamepadJump = false;
    theGamePad = this.input.gamepad.on('down', function(pad, button, index){
        theGamePad = pad
        text.setText('Playing with : ' + pad.id);
        //console.log(pad.id);
        if(pad._RCBottom.pressed && playerInGround === true && counterMovePlayer === 0){ //jump
            gamepadJump = true;
        }
        if(pad._RCLeft.pressed){ //Attack
            gamePadCombo = gamePadCombo + 'A';
            gamepadAttack = true;
        }
        if(pad._LCBottom.pressed){//down
            gamePadCombo = gamePadCombo + 'B';
        }
        if(pad._LCRight.pressed){ //Right
            gamePadCombo = gamePadCombo + 'D';
        }
        if(pad._LCLeft.pressed){  //Left
            gamePadCombo = gamePadCombo + 'G';
        }
        
        
    }, this);

    ////////////////////////////////////////////////////////////////////////////////////////////////

    //ANIMATIONS

    //animation player
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('hero',{frames: [0, 1, 2, 3]}),
        frameRate: 6,
        repeat: -1
    })
    this.anims.create({
        key: 'runRight',
        frames: this.anims.generateFrameNumbers('herorun',{frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
        frameRate: 10,
        //repeat: -1
    })
    this.anims.create({
        key: 'runLeft',
        frames: this.anims.generateFrameNumbers('herorun',{frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
        frameRate: 10,
        //repeat: -1
    })
    firstAtk = this.anims.create({
        key: 'attackOne',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [ 0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6]}),
        frameRate: 27,
        //repeat: -1
    })

    this.anims.create({
        key: 'attackTwo',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]}),
        frameRate: 24,
        //repeat: -1
    })
    this.anims.create({
        key: 'attackThree',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [0, 1, 2, 3, 4, 5, 6, 6, 6, 6]}),
        frameRate: 14,
        //repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('herojump',{frames: [0,0,0,0,1,1,1,1,1,1]}),
        frameRate: 12,
        //repeat: -1
    });
    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('herojump',{frames: [1,1,1,1,1,1]}),
        frameRate: 12,
        //repeat: -1
    });
    this.anims.create({
        key: 'jumpAtk',
        frames: this.anims.generateFrameNumbers('herojumpAtk',{frames: [0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6 , 6, 6]}),
        frameRate: 25,
        //repeat: -1
    });
    this.anims.create({
        key: 'guard',
        frames: this.anims.generateFrameNumbers('heroGuard',{frames: [0]}),
        frameRate: 8,
        //repeat: -1
    });
    this.anims.create({
        key: 'protectGuard',
        frames: this.anims.generateFrameNumbers('heroProtectGuard',{frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4]}),
        frameRate: 8,
        //repeat: -1
    });
    this.anims.create({
        key: 'knockBack',
        frames: this.anims.generateFrameNumbers('heroKnockBack',{frames: [0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5]}),
        frameRate: 8,
    });
    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('heroKnockBack',{frames: [2, 3, 4, 5, 5, 5, 5, 5]}),
        frameRate: 8,
    });
    this.anims.create({
        key: 'shoryuSlash',
        frames: this.anims.generateFrameNumbers('shoryu',{frames: [0, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]}),
        frameRate: 12,
        repeat : -1,
    });
    this.anims.create({
        key: 'pushBox',
        frames: this.anims.generateFrameNumbers('pushBox',{frames: [0, 1, 2, 3, 4, 5]}),
        frameRate: 8,
    });

    ///// animation box

    this.anims.create({
        key: 'damageOne',
        frames: this.anims.generateFrameNumbers('box',{frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
        frameRate: 15,
        //repeat: -1
    });
    this.anims.create({
        key: 'damageTwo',
        frames: this.anims.generateFrameNumbers('box',{frames: [8, 9, 10, 11, 12]}),
        frameRate: 15,
        //repeat: -1
    });
    this.anims.create({
        key: 'damageLast',
        frames: this.anims.generateFrameNumbers('box',{frames: [12, 17, 18, 19, 20, 21, 22, 23]}),
        frameRate: 15,
        //repeat: -1
    });

    ///// animations enemy

    this.anims.create({
        key: 'stancebox',
        frames: this.anims.generateFrameNumbers('box',{frames : [0]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'stanceEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [1]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'stanceCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [10]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'stancePoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [0]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'walkEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [16, 17, 18, 19]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [1, 2, 3, 4]}),
        frameRate: 3,
        repeat : -1,
    });
    // this.anims.create({
    //     key: 'walkbox',
    //     frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [1, 2, 3, 4]}),
    //     frameRate: 4,
    //     repeat : -1,
    // });
    this.anims.create({
        key: 'walkbackEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkbackCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [16, 17, 18, 19, 16, 17, 18, 19, 16, 17, 18, 19]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkbackPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]}),
        frameRate: 2,
        repeat : -1,
    });
    this.anims.create({
        key: 'attackEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 5, 5, 6, 7, 8, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0]}),
        frameRate: 10,
    });
    this.anims.create({
        key: 'attackCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [ 10, 10, 10, 10, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 8, 8, 9, 9]}),
        frameRate: 6,
    })
    this.anims.create({
        key: 'attackPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [ 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 11, 11, 11, 12, 13, 14, 15, 16, 17, 17, 0, 0, 0]}),
        frameRate: 10,
    })
    this.anims.create({
        key: 'knockbackEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [ 10, 11, 11, 11, 11, 11, 11, 11, 0]}),
        frameRate: 35,
    });
    this.anims.create({
        key: 'knockbackCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [ 11, 12, 12, 12, 12, 12, 12, 8, 8]}),
        frameRate: 9,
    });
    this.anims.create({
        key: 'knockbackPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [ 18, 19, 19, 19, 19, 19, 19, 0, 0]}),
        frameRate: 9,
    });
    // this.anims.create({
    //     key: 'knockbackbox',
    //     frames: this.anims.generateFrameNumbers('box',{frames : [ 0]}),
    //     frameRate: 20,
    // });
    this.anims.create({
        key: 'fallEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'fallCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'fallPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [19, 20, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'fallbox',
        frames: this.anims.generateFrameNumbers('box',{frames : [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24]}),
        frameRate: 15,
    })
    this.anims.create({
        key: 'ejectEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'ejectCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'ejectPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22]}),
        frameRate: 8,
    })

    // coin animation
    this.anims.create({
        key: 'turnPiecette',
        frames: this.anims.generateFrameNumbers('piecette',{frames: [1, 1, 2, 3]}),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'slashed',
        frames: this.anims.generateFrameNumbers('slash',{frames: [1, 2, 3]}),
        frameRate: 10,
    });
    this.anims.create({
        key: 'slashedGuard',
        frames: this.anims.generateFrameNumbers('slashGuard',{frames: [0, 1, 2, 3, 4]}),
        frameRate: 30,
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CREATE ENEMIES

    // createEnemies(enemy1Spawn,'box');
    // createEnemies(enemy1Spawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'box');
    // //createEnemies(enemyCrossBowSpawn,'CrossBow');
    // createEnemies(boxSpawn,'box');
    
    // for(var i = 0;i < 1; i++){
    //     setTimeout(()=>{createEnemies(enemy1Spawn, 'Enemy1')},9000 + (i * 7000))
    // }
   
    // for(var i = 0;i < 2; i++){
    //     setTimeout(()=>{createEnemies(enemySpawn,'CrossBow');},9000 + (i * 7000))
    // }

    // for(var i = 0;i < 2; i++){
    //     setTimeout(()=>{createEnemies(enemySpawn,'box');},9000 + (i * 7000))
    // }
    
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    UPDATE 




function update(time, delta){

    //BACKGROUND AND TEXT
    skyBg.x = player.body.position.x;                                                               // position du ciel
    skyBg.y = player.body.position.y;                                                               // position du ciel
    skyBg.tilePositionX += 0.5;
    text.x = player.body.position.x - 345;                                                          // position text
    text.y = player.body.position.y + 120;
    healthBar.x = player.body.position.x - 270;                                                     // position healthbar
    healthBar.y = player.body.position.y - 140;
    healthBar.width = player.data.list.health * 10;
    scoreText.x = player.body.position.x + 260;                                                     // position Score
    scoreText.y = player.body.position.y -150;
    scoreText.setText('SCORE : '+ Score);                                                           // maj score
    spawnDetector.body.velocity.x = player.body.velocity.x ;
    spawnDetector.body.velocity.y = player.body.velocity.y ;
    // spawnReActivator.body.velocity.x = player.body.velocity.x ;
    // spawnReActivator.body.velocity.y = player.body.velocity.y ;
    // spawnDetector.y = player.body.position.y;

    //ENEMY UPDATE
    for(var i = 0; i < hittableObject.children.entries.length; i++){
        if(hittableObject.children.entries[i] != undefined && hittableObject.children.entries[i].data.list.name === 'EnemyOne'){
            
            var currentEnemy = hittableObject.children.entries[i]; 

            //COLLISION Enemy + player

            this.physics.add.collider(currentEnemy, player, function(htblobjct, plyr){              // COLLISIONS
            
            //playerVelocityX = 20;
               
            if(htblobjct.data.list.type === 'box'){
                htblobjct.setVelocityX(0);                                                              //collision player + box
                if(plyr.body.touching.down && htblobjct.body.touching.up){
                    playerInGround = true;
                    htblobjct.setGravityY(-1)
                    // htblobjct.body.moves = true
                }
            }
            });
            ////////////////////////////////////////////////////////////////////////////////////////////

            //OVERLAP player + enemy

            this.physics.add.overlap(currentEnemy, player, function(htblobjct, plyr){                   // overlap player + enemies
                
                if(htblobjct.data.list.AtkCollide === true){                                        // collision Player Guard                     
                    if(plyr.data.list.Guard === true){
                        // htblobjct.data.list.AtkCollide = false;
                        if(plyr.flipX === false && htblobjct.flipX === false){
                            counterMovePlayer = 14;
                            htblobjct.data.list.AtkCollide = false;
                        }

                        else if(plyr.flipX === true && htblobjct.flipX === true){
                            counterMovePlayer = 14;
                            //console.log(plyr.body.velocity);
                            htblobjct.data.list.AtkCollide = false;

                        }else if(plyr.flipX === true && htblobjct.flipX === false){
                            
                            counterMovePlayer = 28
                        }

                        else if(plyr.flipX === false && htblobjct.flipX === true){
                            
                            counterMovePlayer = 28
                        }
                    }else{                                                                          // collision Player KnockBack
                        counterMovePlayer = 28
                        plyr.data.list.health--;
                        htblobjct.data.list.AtkCollide = false;

                    }
                }else{
                    //counterMove = 28
                }
            });

            ////////////////////////////////////////////////////////////////////////////////////////////
            
            //COLLISION Attack + enemy

            this.physics.overlap(currentEnemy, colideATK, collisionAtkEnemies,null,this)
            // this.physics.add.overlap(currentEnemy, colideATK, function(htblObjct, atk){  
                
                // atk.setX(0);
                // atk.setY(0);
                
                
                // //console.log(htblObjct.data.list.CounterMove);
                // //createSlash();
                // //atk.body.enable = false;
                // slashAtk.setY(player.y)
                // if(player.flipX === true){slashAtk.setX(player.x -100)}
                // if(player.flipX === false){slashAtk.setX(player.x +100)}
                // slashAtk.anims.play('slashed', true)
                // slashAtk.rotation = Phaser.Math.Between(0,2);

                // //htblObjct.data.list.health = htblObjct.data.list.health - 1;   
                
                // if(htblObjct.data.list.IsInvulnerable === false)
                // {
                //     htblObjct.data.list.CounterMove = 3;
                //     PlayerTouchEnemy = true;
                //     player.anims.pause();
                //     setTimeout(()=>{
                //         player.anims.resume()
                //         slashAtk.setX(0);
                //         atk.body.enable = true;
                //     },150)
                //     // htblObjct.data.list.health = htblObjct.data.list.health - 1; 
                //     //console.log(htblObjct.data.list.health);
                //     //console.log(htblObjct.data.list);
                // }else{
                // }
            // })

            //////////////////////////////////////////////////////////////////////////////////////////////

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) >= 200 &&                        // walk enemies
            currentEnemy.data.list.AttackIsFinish === true &&
            currentEnemy.data.list.CounterMove != 3){
                currentEnemy.data.list.CounterMove = 1; 
                currentEnemy.data.list.EnemyIsAttack = true; 
            }

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) < 300 &&                         // attack CrossBow
            Phaser.Math.Distance.BetweenPoints(currentEnemy,player) > 149 &&
            currentEnemy.data.list.AttackIsFinish === true &&
            currentEnemy.data.list.type === 'CrossBow'){

                currentEnemy.data.list.CounterMove = 2; 
            }



            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) <= 149 &&                        // action enemies
            currentEnemy.data.list.type != 'box' &&
            currentEnemy.data.list.EnemyIsAttack === true && 
            currentEnemy.data.list.AttackIsFinish === true){
                currentEnemy.data.list.AttackIsFinish = false
                currentEnemy.data.list.EnemyIsAttack = false
                if(currentEnemy.data.list.randomValue % 2 === 1){
                    currentEnemy.data.list.CounterMove = 2;
                    currentEnemy.data.list.randomValue = currentEnemy.data.list.randomValue + 1;
                }else{
                    currentEnemy.data.list.CounterMove = 5;
                    currentEnemy.data.list.randomValue = currentEnemy.data.list.randomValue + 1;
                }
            }

            if(currentEnemy.data.list.CounterMove != 28){        // action enemies
                if(currentEnemy.data.list.health <= 0){
                    currentEnemy.data.list.CounterMove = 4
                }
                switch(currentEnemy.data.list.CounterMove){
                    case 0: enemyStand(currentEnemy); break;
                    case 1: enemyWalkFront(currentEnemy,player,this); break;
                    case 2: enemyAttack(currentEnemy); break;
                    case 3: enemyKnockBack(currentEnemy); break;
                    case 4:
                        if(currentEnemy.data.list.EnemyIsDie === false)
                        {
                            enemyDie(currentEnemy);
                        }
                        break;
                    case 5: enemyWalkBack(currentEnemy,player,this); break;
                    case 6:
                    case 7:
                    default:
                        //do nothing
                        break;
                }


                if(currentEnemy.data.list.EnemyIsDie === true)
                {
                    // Delete arrow for the crossbow enemy
                    if(currentEnemy.data.list.type == "CrossBow")
                    {
                        var currentArrow = null;

                        for(var i = 0; i < Arrow.children.entries.length; i++)
                        {
                            if(currentEnemy.data.list.id_arrow == Arrow.children.entries[i].data.list.id)
                            {
                                currentArrow = Arrow.children.entries[i]; // Arrow found
                                break;
                            }
                        }

                        if(currentArrow != null)
                        {
                            Phaser.Utils.Array.RemoveAt(Arrow.children.entries, i);
                            currentArrow.destroy()
                        }
                    }

                    // Delete enemy
                    Phaser.Utils.Array.RemoveAt(hittableObject.children.entries, i);
                    currentEnemy.destroy()
                }
            
            }
            
        }
        else if(hittableObject.children.entries[i].data.list.name === 'slash'){                         //img attack slash
            hittableObject.children.entries[i].body.checkCollision.none = true;
            if(player.flipX === true){
                hittableObject.children.entries[i].x = player.x - 90
                hittableObject.children.entries[i].y = player.y
            }else{
                hittableObject.children.entries[i].x = player.x + 90
                hittableObject.children.entries[i].y = player.y
            }
        }

        else{hittableObject.children.entries[i] = [];} 
    }
    //console.log(player.data.list.Eject);
    //console.log(currentEnemy);
    //console.log(Arrow);
    //console.log(Phaser.Math.Distance.BetweenPoints(hittableObject.children.entries[0],player));
    //console.log(enemyMoveDetection.children.entries[0]);
    //enemyMoveDetection.children.entries[0].body.destroy()
    //console.log(counterMove);
    //console.log(Arrow);
    //console.log(PlayerTouchEnemy);
    //console.log(colideATK2);
    //console.log(playerInGround);
    //console.log(returnRandomNumber(10, 20));
    //console.log('AtkCollide : '+ hittableObject.children.entries[0].data.list.AtkCollide);
    //console.log(player.data.list.Eject);
    //console.log(box.children.entries);
    //console.log(playerInGround);
    //console.log(-26 * 6);
    //console.log(hittableObject.children.entries);
    //console.log(hittableObject.children.entries[0].data.list.CounterMove);
    //console.log(currentEnemy);
    //console.log(player.anims.currentAnim);
    //console.log(player.anims.currentAnim);
    //console.log('countTest : '+countTest);
    //console.log(attackintheair);
    //console.log(attackinground);
    //console.log(EnemyIsDie);
    //console.log(player.body.velocity.y);
    //console.log(playerCanFall);
    //theGamePad.left = true
    //console.log(theGamePad);
    //console.log(theGamePad.gamepads);
    //console.log(this.input.gamepad.total);
    //console.log(this.input.gamepad.gamepads.length);
    //if(player.flipX === true && player.body.velocity.x === 0){console.log('flip');}
    //console.log(player.body.velocity.y);
    

    if(counterMovePlayer === 28){
        KnockBack()
    }
    if(counterMovePlayer === 14){
        GuardKnockBack()
    }
    if(player.data.list.health <= 0){                                                              //Player Die
        counterMovePlayer = 999;
        player.data.list.health = 0;
        // player.body.checkCollision.right = false;
        // player.body.checkCollision.left = false;
    }
    // CONTROL PLAYER

    if((theGamePad.X)){                                                                             //Gamepad Combo
            if(counterMovePlayer === 0 && gamePadCombo.includes("BDA") || gamePadCombo.includes("BGA")){
                if(playerInGround === true){
                    counterMovePlayer = 32;
                    tornadoSlash();
                    //console.log('tornadoSash');
                    gamePadCombo = [];
                }
            }else{
                gamePadCombo = [];
            }
    }
   
        if (leftkey.isDown && counterMovePlayer === 0 || theGamePad.left  && counterMovePlayer === 0){              //left
                player.setVelocityX(-playerVelocityX);
                playerFlip = player.flipX=true;

                if(playerInGround === true){
                    player.anims.play('runLeft', true);
                }
            }
        else if (rightkey.isDown && counterMovePlayer === 0 || theGamePad.right && counterMovePlayer === 0){       //right
                player.setVelocityX(playerVelocityX);
                playerFlip = player.flipX=false;
            
                if(playerInGround === true){
                    player.anims.play('runRight', true);
                }
            }
        else if (player.setVelocityX(0)){                                                               //idle
                if(playerInGround === true && counterMovePlayer === 0){
                    player.anims.play('idle', true);
                    player.setGravityY(0);
                    player.body.checkCollision.right = true;
                    player.body.checkCollision.left = true;
                }
            }

        
        if (Phaser.Input.Keyboard.JustDown(upkey) && playerInGround === true && counterMovePlayer === 0       //jump
        || gamepadJump === true && playerInGround === true && counterMovePlayer === 0){ //gamepad
            gamepadJump = false
            player.setVelocityY(-450);
            playerInGround = false;
            jumpAction();
        }
        if(player.body.velocity.y > 0 &&                                                                //fall
            attackintheair === false &&                                    
            counterMovePlayer != 28 && 
            counterMovePlayer != 14 && 
            playerCanFall === true &&
            attackinground === false){               
            fallAction()
            playerInGround = false
        }     
        
        if (touchesGuard.isDown && playerInGround === true && counterMovePlayer === 0 ||
            theGamePad.Y && playerInGround === true && counterMovePlayer === 0 ){                             //guard
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('guard', true);
            player.data.list.Guard = true
        }else if(touchesGuard.isUp && playerInGround === true && counterMovePlayer != 14){
             player.data.list.Guard = false}
        
        if(Phaser.Input.Keyboard.JustDown(touchesAttack) || gamepadAttack === true){                    //attack                                            //attack
            gamepadAttack = false;
            counterMovePlayer++;
            if(counterMovePlayer === 1 && playerInGround === true){attackComboOne();}
            else if (counterMovePlayer >= 2 && playerInGround === true){attackComboTwo();}
            else if(counterMovePlayer === 1 && playerInGround === false){attackJump();}
        }    
}

//FUNCTIONS

function attackComboOne(){                                                                              // attack one
        attackinground = true;
        var nameAttack = 'attackOne'
        player.anims.play(nameAttack, true);
        //var colAtk2 = colideATK2.get(); 
        //colAtk2.setScale(2)
        //colAtk2.visible = false;
            player.on('animationupdate', ()=>{
                if(nameAttack === player.anims.currentAnim.key){
                    if(4 === player.anims.currentFrame.index){
                            // if(playerFlip === true){colAtk2.setX(player.x -80);colAtk2.setY(player.y);}
                            // if(playerFlip === false){colAtk2.setX(player.x +80);colAtk2.setY(player.y)}      
                            if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y);}
                            if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y)}    
                    };
                    if(player.anims.currentFrame.index >= 5){
                        colideATK.setX(0)
                        //colAtk2.destroy()
                    }
                    if(player.anims.currentFrame.index >= 6){
                        countTest = 1
                    };
                    if(13 === player.anims.currentFrame.index){
                        counterMovePlayer = 0;
                        //colideATK.body.enable = true;
                        attackinground = false;
                    }
                }
            })
   
}
function attackComboTwo(){                                                                              //attack two

if(player.anims.currentAnim.key === 'attackOne'){
    if(countTest === 1){
        player.anims.play('attackTwo', true);
    var nameAttack2 = 'attackTwo'
    // var colAtk2 = colideATK2.get();
    // colAtk2.setScale(2)
    // colAtk2.setSize(60,60)
    // colAtk2.visible = false;

    player.on('animationupdate', ()=>{
        if(nameAttack2 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 3){
            }
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y)}
            }
            if(player.anims.currentFrame.index >= 5){
                colideATK.setX(0)
                // colAtk2.destroy()
            }
            if(12 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMovePlayer = 0;
                countTest = 0;
                //colideATK.body.enable = true;
                attackinground = false;
            }
        }
    });
    
    }
}else{}                                                                                                 // attack three
}
function attackComboThree(){
    player.anims.play('attackThree', true);
    var nameAttack3 = 'attackThree'
    var colAtk2 = colideATK2.get();
    
    colAtk2.visible = false;


    player.on('animationupdate', ()=>{
        if(nameAttack3 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk2.setX(player.x -140);colAtk2.setY(player.y)}
                if(playerFlip === false){colAtk2.setX(player.x +140);colAtk2.setY(player.y)} 
            }
            if(player.anims.currentFrame.index <= 6){
                if(playerFlip === true){player.setVelocityX(-500)}
                if(playerFlip === false){player.setVelocityX(500)}
                touchesAttack.enabled = false; 
            }

            if(player.anims.currentFrame.index >= 8){
                touchesAttack.enabled = true; 
                colAtk2.setY(player.y - 9999)//position en dehors de l'éccran
            }
            if(10 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMovePlayer = 0;
            }
        }
    });
}
function jumpAction(){                                                                                      // Jump
        player.anims.play('jump', true);
}
function fallAction(){                                                                                      // Fall
        player.anims.play('fall', true)   
}

function attackJump(){                                                                                      //attack jump
    player.anims.play('jumpAtk', true);
    var nameAttack4 = 'jumpAtk';
    // var colAtk5 = colideATK2.get();
    // colAtk5.setScale(2)
    // colAtk5.setSize(60,60)
    // colAtk5.visible = false;
    attackintheair = true;
    player.on('animationupdate', ()=>{
        if(nameAttack4 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colideATK.setX(player.x -65);colideATK.setY(player.y +20)}
                if(playerFlip === false){colideATK.setX(player.x +65);colideATK.setY(player.y +20)} 
            }
            if(player.anims.currentFrame.index >= 5){
                colideATK.setX(0)
            }
            if(playerInGround === true || player.anims.currentFrame.index >= 25){
                counterMovePlayer = 0; 
                //colideATK.body.enable = true;
                // colAtk5.destroy();
            ;}
        }
    });
}
function tornadoSlash(){                                                                                      // tornado slash
    playerCanFall = false;
    //console.log(player.body.checkCollision);
    player.anims.play('shoryuSlash', true);

    var nameAttack = 'shoryuSlash';
    // var colAtk = colideATK2.get().setSize(60,60);
    // var colAtkTwo = colideATK2.get().setSize(80,60);
    // var colAtkThree = colideATK2.get().setSize(60,60);

    // colAtk.visible = false;
    // colAtkTwo.visible = false;
    // colAtkThree.visible = false;

    player.on('animationupdate', ()=>{

        if(nameAttack === player.anims.currentAnim.key){

            if(player.anims.currentFrame.index <= 3 ){
                player.setGravityY(-1200);
                if(playerFlip === true){player.setVelocityX(-playerVelocityX * 4)}
                if(playerFlip === false){player.setVelocityX(playerVelocityX * 4)} 
                // console.log(player.body.checkCollision.left = false);
                // console.log(player.body.checkCollision.right = false);
            }

            if(player.anims.currentFrame.index === 2 ){
                //player.anims.stop()
                if(playerFlip === true){colideATK.setX(player.x -84);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +84);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index >= 3 ){
                player.data.list.Eject = false;
                colideATK.setX(0);
                //colideATK.body.enable = true;
                
            }
            if(player.anims.currentFrame.index === 4 ){
                player.setGravityY(0);
                player.data.list.Eject = true;
                //player.anims.stop()
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y -32)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y -32)} 
            }

            if(player.anims.currentFrame.index === 5 ){
                //colideATK.body.enable = true;
                colideATK.setX(0)
            }
                if(player.anims.currentFrame.index === 6 ){
                //colAtkTwo.destroy();
                //player.anims.stop()
                colideATK.setY(player.y -120)
                if(playerFlip === true){colideATK.setX(player.x -30);}
                if(playerFlip === false){colideATK.setX(player.x +30);} 
            }
            
            if(player.anims.currentFrame.index === 7 ){
                // colAtkThree.destroy();
                colideATK.body.enable = true;
                colideATK.setX(0);
            }

            if(player.anims.currentFrame.index >= 4 &&
                player.anims.currentFrame.index <= 6){
                player.setVelocityY(-320)
            }

            if(player.anims.currentFrame.index >= 16){
                player.data.list.Eject = false;

                if(player.body.velocity.y != 0){
                    playerCanFall = false

                }else{
                    playerCanFall = true;
                    counterMovePlayer = 0;
                }
                
            }
        }
    });
}

function KnockBack(){                                                                                  // Knock Back
    player.data.list.Eject = false;
    playerCanFall = false
    player.anims.play('knockBack', true);
    var nameAction = 'knockBack';
    player.on('animationupdate', ()=>{
        if(nameAction === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <=4){
                if(player.flipX === true){
                    player.setVelocityX(400)
                }
                if(player.flipX === false){
                    player.setVelocityX(-400)
                } 
            }
            if(player.anims.currentFrame.index >=5){
                if(player.data.list.health > 0){
                    if(player.body.velocity.y != 0){
                        playerCanFall = false
                    }else{
                        playerCanFall = true;
                        counterMovePlayer = 0;
                    }
                }else{
                    player.setGravityY(-1500)
                    // player.body.checkCollision.right = false;
                    // player.body.checkCollision.left = false;
                    if(player.flipX === true){
                        player.setGravityX(10000)
                        
                    }
                    if(player.flipX === false){
                        player.setGravityX(-10000)
                    } 
                }
            }
            if(player.anims.currentFrame.index >=10){
                player.setGravityY(-600)
            }
            if(player.anims.currentFrame.index >=12){
                player.setGravityY(4000)
            }
            if(player.anims.currentFrame.index >=18){
                player.setGravityX(0)
                if(player.body.velocity === 0){
                    //player.body.destroy();
                }
            }
        }
    });
}

function GuardKnockBack(){  
    player.data.list.Guard = true                                                                            // Guard
    player.data.list.Eject = false;
    playerCanFall = false
    player.anims.play('protectGuard', true);
    var nameAction = 'protectGuard';
    player.on('animationupdate', ()=>{
        if(nameAction === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <=4){
                if(playerFlip === true){player.setVelocityX(300)}
                if(playerFlip === false){player.setVelocityX(-300)} 
            }
            if(player.anims.currentFrame.index >=5){
                if(player.body.velocity.y != 0){
                    playerCanFall = false
                }else{
                    playerCanFall = true;
                        counterMovePlayer = 0;   
                }
            }
        }
    });
}

function createCoin(thebox){                                                                            //Coin
    var randomNbr = Phaser.Math.Between(-55, 2);
    var piece = Coin.create(thebox.x + randomNbr, thebox.y + randomNbr,'piecette',0,true);
    piece.setScale(2);
    piece.anims.play('turnPiecette',true)
    piece.setBounce(1);
    piece.setVelocityX(Phaser.Math.Between(-110, 110))
   
    //setTimeout(()=>{piece.setVelocityX(0);},1000)
}

function createSlash(){
    var slash = hittableObject.create(0,0,'slash',0,true);
    slash.anims.play('slashed', true)
    slash.rotation = Phaser.Math.Between(0,2);
    slash.setScale(2);
    slash.setData('name', 'slash');
    slash.on('animationcomplete', ()=>{
        slash.destroy();
        PlayerTouchEnemy = false
    });
}
function createSlashGuard(){
    var slash = hittableObject.create(0,0,'slashGuard',0,true);
    slash.anims.play('slashedGuard', true)
    
    //slash.setScale(2);
    slash.setData('name', 'slash');
    enemyone.setSize(5, 5);
    slash.on('animationcomplete', ()=>{
        slash.destroy();
        PlayerTouchEnemy = false
    });
}

function createEnemies(enemySpawner, typeOfEnemy){                                                      //create Enemies
    var enemyone = hittableObject.create(enemySpawner.x, enemySpawner.y -100,'enemy', 0, true);
    console.log(enemySpawner.y);
    var animsName = 'stance'+typeOfEnemy;
    var id = enemyNumberId++;
    enemyone.anims.play(animsName,true);
    enemyone.setSize(25, 56);
    enemyone.setScale(2);
    enemyone.setData('CounterMove', 0);
    enemyone.setData('EnemyIsAttack', false);
    enemyone.setData('AttackIsFinish', true);
    enemyone.setData('AtkCollide', false);
    enemyone.setData('EnemyIsDie', false);
    enemyone.setData('IsInvulnerable', false);
    enemyone.setData('health', 8);
    enemyone.setData('name', 'EnemyOne');
    enemyone.setData('type', typeOfEnemy);
    enemyone.setData('id', id);
    enemyone.setData('id_arrow', id);
    enemyone.setData('randomValue',Phaser.Math.Between(25,100));
    enemyone.body.checkCollision.up = false
    //enemyone.setMass(22)
    //enemyone.setFriction(1)
    enemyone.setDepth(0);

    if(typeOfEnemy === 'CrossBow'){                                                                     //create Arrow
        var arrow = Arrow.create(enemyone.x, enemyone.y - 9,'carreau',0,true);
        arrow.setSize(20, 4);
        arrow.setData('id', id);
    }
    if(typeOfEnemy === 'PoleAxe'){
        enemyone.setData('health', 20);
        enemyone.setData('randomValue',Phaser.Math.Between(10,50));
    }
    if(typeOfEnemy === 'box'){                                                                          //create box
        enemyone.setSize(35, 35);
        enemyone.body.checkCollision.up = true;
        enemyone.body.checkCollision.left = false;
        enemyone.body.checkCollision.right = false;
        enemyone.setData('health', 3);
    }       
}

function enemyStand(enmy1){                                                                             // enemy stance
    enmy1.setVelocityX(0);
    enmy1.data.list.EnemyIsAttack = true
}

function enemyWalkFront(enemy1,target,game){                                                            // enemy Walk
enemy1.setBounce(0, 0)
if(enemy1.data.list.type != 'box'){
    var animsName = 'walk'+enemy1.data.list.type;

    enemy1.anims.play(animsName, true)

    enemy1.on('animationupdate', ()=>{
        if(animsName === enemy1.anims.currentAnim.key){
            game.physics.moveToObject(enemy1, target, enemy1.data.list.randomValue);
            enemy1.setVelocityY(300);
            if(enemy1.body.velocity.x != 0){    //flip enemy
                if(enemy1.body.velocity.x < 0){
                    enemy1.flipX = false;
                }else{enemy1.flipX = true;}
            }
        }
    })
}else{}    
    

}

function enemyWalkBack(enemy1,target,game){                                                             // enemy walkBack
    enemy1.setBounce(0, 0)
    var animsName = 'walkback'+enemy1.data.list.type;
    enemy1.anims.play(animsName, true)

    game.physics.moveToObject(enemy1, target, - (enemy1.data.list.randomValue));
    enemy1.data.list.AttackIsFinish = false
    enemy1.setVelocityY(400);
    
    enemy1.on('animationupdate', ()=>{
        if(animsName === enemy1.anims.currentAnim.key){
            if(enemy1.anims.currentFrame.index >= 4){
                enemy1.data.list.CounterMove = 2
                enemy1.data.list.AttackIsFinish = true
            }
        }
    });
    if(enemy1.body.velocity.x != 0){    //flip enemy
        if(enemy1.body.velocity.x < 0){
            enemy1.flipX = true;
        }else{enemy1.flipX = false;}
    }
}

function enemyAttack(enemyone, currentArrow){
    enemyone.setVelocityX(0);
    var animsName = 'attack'+enemyone.data.list.type;
    //console.log(animsName);

    enemyone.anims.play(animsName,true)
    
    enemyone.on('animationupdate', ()=>{                                                                // attack enemy1
        if('attackEnemy1' === enemyone.anims.currentAnim.key){
            if(enemyone.anims.currentFrame.index >= 4 &&
                enemyone.anims.currentFrame.index <= 6){
                    if(enemyone.flipX === true){enemyone.setVelocityX(200)}
                    if(enemyone.flipX === false){enemyone.setVelocityX(-200)}
            }
            if(enemyone.anims.currentFrame.index === 5){
                enemyone.data.list.AtkCollide = true
                
                enemyone.setSize(100,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },50)
            }
            if(enemyone.anims.currentFrame.index >= 12){ 
                enemyone.data.list.CounterMove = 0
                enemyone.data.list.AttackIsFinish = true
            }
        }
        if('attackPoleAxe' === enemyone.anims.currentAnim.key){                                              //attack PoleAxe

            if(enemyone.anims.currentFrame.index < 12 ){
                enemyone.data.list.IsInvulnerable = true
            }
            if(enemyone.anims.currentFrame.index === 12 ){
                enemyone.data.list.AtkCollide = true
                enemyone.setSize(140,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },150)
            }
            if(enemyone.anims.currentFrame.index >= 15){
                    enemyone.data.list.IsInvulnerable = false
            }
            if(enemyone.anims.currentFrame.index === 21 ){
                enemyone.data.list.AtkCollide = true
                enemyone.setSize(180,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },150)
            }

            if(enemyone.anims.currentFrame.index >= 28){ 
                enemyone.data.list.IsInvulnerable = false
                enemyone.data.list.CounterMove = 0
                enemyone.data.list.AttackIsFinish = true
            }
        }
        if('attackCrossBow' === enemyone.anims.currentAnim.key){                                              //attack CrossBow
            if(enemyone.anims.currentFrame.index === 9)
                {
                    createArrow(enemyone);
                }
        }
    });
}

function createArrow(enemy){                                                                             // call Arrow 
    var currentArrow = null;

    for(var i = 0; i < Arrow.children.entries.length; i++)
    {
        if(Arrow.children.entries[i].data.list.id === enemy.data.list.id_arrow)
        {
            currentArrow = Arrow.children.entries[i];
            break;
        }
    }

    if(currentArrow != null)
    {
        currentArrow.setY(enemy.y - 35)  

        if(enemy.flipX === true)
        {
            currentArrow.flipX = true;
            currentArrow.setX(enemy.x + 50)
            currentArrow.setVelocityX(200)
        }
        else
        {
            currentArrow.flipX = false;
            currentArrow.setX(enemy.x - 50) 
            currentArrow.setVelocityX(-200)
        }
    }
}

function enemyKnockBack(enmy){
//console.log('hello');
    if(player.data.list.Eject === false){                                                               // knock back enemy
                                                             
        if(enmy.data.list.type != 'box'){

            enmy.data.list.EnemyIsAttack = false;
            var animsName = 'knockback'+enmy.data.list.type
            enmy.anims.play(animsName,true);
            //var enemyAction2 = 'knockbackEnemy1';
            //console.log(animsName);
                enmy.on('animationupdate', ()=>{
                    if(animsName === enmy.anims.currentAnim.key){
                    
                        if(enmy.anims.currentFrame.index <= 2){

                            if(enmy.flipX === true){enmy.setVelocityX(1200)}
                            if(enmy.flipX === false){enmy.setVelocityX(-1200)}
                            
                        }
                        if(enmy.anims.currentFrame.index <= 3){
                            
                            if(enmy.flipX === true){enmy.setVelocityX(-100)}
                            if(enmy.flipX === false){enmy.setVelocityX(100)}   
                        }
                        if(enmy.anims.currentFrame.index >= 5 &&
                            player.data.list.Eject === false){ 
                                enmy.data.list.CounterMove = 0

                            enmy.data.list.AttackIsFinish = true
                        }
                    }
                });
        }else{                                                                                              //knock box
            if(enmy.data.list.health === 2){
                enmy.anims.play({key : 'damageOne', startFrame : 0},true);
            }
            if(enmy.data.list.health === 1){
                enmy.anims.play({key : 'damageTwo', startFrame : 0},true);
            }
            enmy.on('animationupdate', ()=>{
                
                if(enmy.anims.currentFrame.index === 8){
                    //enmy.data.list.CounterMove = 0
                    enmy.data.list.AttackIsFinish = true
                }
                if(enmy.anims.currentFrame.index === 5){
                    //enmy.data.list.CounterMove = 0
                    enmy.data.list.AttackIsFinish = true
                }
            });
        }

    }else{                                                                                                  // eject enemy
        enmy.data.list.EnemyIsAttack = false;
        var animsName2 = 'eject'+enmy.data.list.type
        enmy.anims.play(animsName2,true);
        
        enmy.data.list.CounterMove = 77;
        //enmy.body.setSize(15,56)
            enmy.on('animationupdate', ()=>{
                if(animsName2 === enmy.anims.currentAnim.key){
                    if(enmy.anims.currentFrame.index <= 3){
                        if(enmy.flipX === true){enmy.setVelocityX(-200)}
                        if(enmy.flipX === false){enmy.setVelocityX(200)}  
                        enmy.setVelocityY(-300)

                    }
                    if(enmy.anims.currentFrame.index === 5){
                        if(enmy.flipX === true){enmy.setVelocityX(-100)}
                        if(enmy.flipX === false){enmy.setVelocityX(100)}   
                        enmy.setVelocityY(-200)
                    }
                    if(enmy.anims.currentFrame.index >= 6 &&
                        enmy.anims.currentFrame.index <= 7){
                            if(enmy.flipX === true){enmy.setVelocityX(-200)}
                            if(enmy.flipX === false){enmy.setVelocityX(200)}
                            enmy.setVelocityY(0)
                        }
                        if(enmy.anims.currentFrame.index >= 8 &&
                            enmy.anims.currentFrame.index <= 10){
                                if(enmy.flipX === true){enmy.setVelocityX(-100)}
                                if(enmy.flipX === false){enmy.setVelocityX(100)}   
                                enmy.setVelocityY(250)
                                enmy.setBounce(0.5,0.5)
                        }
                    if(enmy.anims.currentFrame.index >= 11){
                        enmy.setVelocityX(0)
                        enmy.setBounce(0,0)                
                    }
                    if(enmy.anims.currentFrame.index >= 20 &&
                        enmy.body.velocity.y === 0){ 
                        enmy.data.list.AttackIsFinish = true
                            enmy.setVelocityX(0)
                            if(enmy.data.list.type === 'CrossBow'){
                                enmy.data.list.CounterMove = 2
                            }else{
                                // enmy.data.list.CounterMove = 0
                            }
                    }
                }
            });
    }
}

function enemyDie(enmyOne){
    enmyOne.setBounce(0,0) 
    var animsName = 'fall'+enmyOne.data.list.type
    enmyOne.anims.play(animsName, true);
    enmyOne.on('animationupdate', ()=>{
        if(enmyOne.anims != undefined){
            if(animsName === enmyOne.anims.currentAnim.key){
                if(enmyOne.anims.currentFrame.index <= 3 &&
                    enmyOne.data.list.type != 'box'){
                    if(enmyOne.flipX === true){enmyOne.setVelocityX(-75)}
                    if(enmyOne.flipX === false){enmyOne.setVelocityX(75)}
                }
                if(enmyOne.anims.currentFrame.index >= 6){
                    if(enmyOne.body.velocity.y !=0){
                        enmyOne.setVelocityX(0)
                        enmyOne.setVelocityY(300)
                    }else{enmyOne.body.destroy(); }
                } 
                if(enmyOne.anims.currentFrame.index === 10 &&
                    enmyOne.data.list.type === 'box'){
                    enmyOne.data.list.EnemyIsDie = true;
                    createCoin(enmyOne)
                    enmyOne.body.destroy();
                    }
                if(enmyOne.anims.currentFrame.index >= 14){ 
                    enmyOne.data.list.EnemyIsDie = true;
                    // enmyOne.body.destroy(); 
                }
            }
        }else{console.log(hittableObject.children.entries);}   
    });
}
function collisionAtkEnemies(htblObjct,atk){
    atk.setX(0);
    atk.setY(0);
    
    
    //console.log(htblObjct.data.list.CounterMove);
    //createSlash();
    //atk.body.enable = false;
    slashAtk.setY(player.y)
    if(player.flipX === true){slashAtk.setX(player.x -100)}
    if(player.flipX === false){slashAtk.setX(player.x +100)}
    slashAtk.anims.play('slashed', true)
    slashAtk.rotation = Phaser.Math.Between(0,2);

    htblObjct.data.list.health = htblObjct.data.list.health - 1;   
    
    if(htblObjct.data.list.IsInvulnerable === false)
    {
        htblObjct.data.list.CounterMove = 3;
        PlayerTouchEnemy = true;
        player.anims.pause();
        setTimeout(()=>{
            player.anims.resume()
            slashAtk.setX(0);
            //atk.body.enable = true;
        },150)
        // htblObjct.data.list.health = htblObjct.data.list.health - 1; 
        //console.log(htblObjct.data.list.health);
        //console.log(htblObjct.data.list);
    }else{
    }
    //console.log('kikou');
}




