var configuration = {
    type: Phaser.AUTO,
    pixelArt : true,
    width : 3000,
    height : 1780,
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
    audio: {
        disableWebAudio: true
    }
}

var game = new Phaser.Game(configuration);

var cameraPlayer;

var startGame; //Boolean
var controlHelp;
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

var TouchLeft;
var TouchRight;
var TouchUp;
var TouchDown;
var TouchJump;
var TouchAttack;

var rageValue;

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
var rageMode; // : boolean
var canShoryu; // : boolean


var enemy1Spawn; //spawn enemy
var enemyCrossBowSpawn;
var boxSpawn;


var enemyNumberId;
var colideATK;

var box;    // caisse en bois : sprite

var comboValue = 0;
var comboText;
var text;  // info command list
var Score = 0; // Score
var personalBestText;
var scoreText;
var gameOverText;
var funText;
var messageFunText = '';
var messageFunTextList;

var healthBar; 
var specialBar;

var Coin;  //pieces
var skyBg; //ciel
var Arrow;
var DestroyArrow;
var rageCloud;
var oldfilter;

var spawnDetector;
var spawnReActivator;
var spawnCounter = 0;
var CrossPlatform;

var spebar;
var countTest = 0;

//song
var themeSong;
var gameoverSong;
var swordImpact;
var swordImpact2;
var coinImpact;

var soundVolume = 0;

var currentEnemy;
var enemyCanDie = false;

var personalBest;                                               //best score in localStorage
var GameOver = false;

function preload(){
////////////////////////////////////////////////////// LOADING

    this.load.on('progress', function (value) {
        console.log(value);
    });
                
    this.load.on('fileprogress', function (file) {
        console.log(file.src);
    });
    this.load.on('complete', function () {
        console.log('complete');
    });

//////////////////////////////////////////////////////////////
    this.load.audio('theme', ['assets/audio/gamesong.mp3']);
    this.load.audio('gameover', ['assets/audio/gameover.mp3']);
    this.load.audio('swordImpact', ['assets/audio/Impact5.mp3']);
    this.load.audio('swordImpact2', ['assets/audio/swordImpact4.wav']);
    this.load.audio('coinImpact', ['assets/audio/coinImpact.wav']);
    this.load.audio('air', ['assets/audio/Air.mp3']);
    this.load.audio('ImpactEnemies', ['assets/audio/Poutchack.mp3']);

    this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');   
    this.load.image('sky','assets/Thesky.png');
    this.load.image('ground','assets/solPave.png');
    this.load.image('ATK1','assets/TRlogo.png');
    this.load.image('spawner','assets/ROELprod.png');
    this.load.image('carreau', 'assets/carreau.png');
    this.load.image('spebar', 'assets/Spebar.png');
    this.load.image('oldTvFilter', 'assets/IMG_0567.jpg');
    this.load.spritesheet('sfx','assets/Sprites/SFXGROUPE.png', {frameWidth : 170, frameHeight : 170});
    
    this.load.image('forest', 'assets/levelOne/Decor2.png');
    this.load.tilemapTiledJSON('tiles', 'assets/levelOne/forest.json')

    this.load.spritesheet('controlHelp','assets/controlHelp.png', {frameWidth : 501, frameHeight : 318});
    this.load.spritesheet('slash','assets/Slash.png', {frameWidth : 65, frameHeight : 65});
    this.load.spritesheet('slashGuard','assets/SlashGuard.png', {frameWidth : 8, frameHeight : 23});
    this.load.spritesheet('piecette','assets/Coin.png', {frameWidth : 8, frameHeight : 8});
    this.load.spritesheet('hero', 'assets/Sprites/stancearmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroAttack', 'assets/Sprites/swordattackmove.png',{frameWidth: 170, frameHeight: 170});
    // this.load.spritesheet('heroAttacktwo', 'assets/Sprites/3hitcombo.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroAttackthree', 'assets/Sprites/3ndhit.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herorun', 'assets/Sprites/walkarmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojump', 'assets/Sprites/jumparmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojumpAtk', 'assets/Sprites/jump_sword_attack.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('specialairslash', 'assets/Sprites/specialairslash.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroGuard', 'assets/Sprites/guard.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroProtectGuard', 'assets/Sprites/Playerkbtest.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroKnockBack', 'assets/Sprites/KnockBack.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('shoryu', 'assets/Sprites/shoryu.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('shieldTackle', 'assets/Sprites/coupdebouclier2.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('ultimate', 'assets/Sprites/SuperAttack.png',{frameWidth: 170, frameHeight: 170});
    //this.load.spritesheet('pushBox', 'assets/Sprites/pousse.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroClimb', 'assets/Sprites/escalade.png',{frameWidth: 170, frameHeight: 170});
    //this.load.spritesheet('carreau', 'assets/carreau.png',{frameWidth: 20, frameHeight: 4});

    // this.load.spritesheet('powerSlash', 'assets/PowerSlash.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('box', 'assets/box.png',{frameWidth: 62, frameHeight: 62});
    this.load.spritesheet('theEnemy', 'assets/Enemy/enemiaxe.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyfall', 'assets/Enemy/enemi1falling.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyCrossBow', 'assets/Enemy/arbaletrier.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyPoleAxe', 'assets/Enemy/poleaxegiant.png',{frameWidth: 180, frameHeight: 170});
    this.load.spritesheet('theEnemySpearMan', 'assets/Enemy/spearman.png',{frameWidth: 190, frameHeight: 170});
    this.load.spritesheet('theEnemyAssassin', 'assets/Enemy/assassin.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyRunMan', 'assets/Enemy/runman.png',{frameWidth: 170, frameHeight: 170});

}

/////////////////////////////////////////////////////////////////////////////////////       CREATE
function create(){

    //	You can listen for each of these events from Phaser.Loader

    if(localStorage.getItem('score') === null){
        personalBest = 0;
    }else{
        personalBest = localStorage.getItem('score');                                               //best score in localStorage
    }
    /// SET VARIABLE  

    startGame = true;
    attackintheair = false;
    counterMovePlayer = 0;
    playerVelocityX = 270;
    playerInGround = false;
    PlayerTouchEnemy = false;
    attackinground = false;
    playerCanFall = true;
    gamePadCombo = [];
    enemyNumberId = 0;
    rageMode = false;
    canShoryu = true
    messageFunTextList = ['','Good !', 'Nice !','Yes !','Strike !','Cool !','Perfect !','Graceful !','Nicely Done ! ','Impressive !','Remarkable !','Powerful !','All That Power !?','Excellent','Slice !!','RAGE MODE !','it\'s not possible!?','Fast Fury!!!','INTENSE!!','Sword Master!!','Destroy Them All!!','Slices The Universe!!','WAOUH!!!','Rapid Anger','Incredible!!','Marvelous!!','Oh My God!','Unthinkable!!','Gracious!!','MAD!!','Powerful!!','STRONG!!','Fast Combo!!!','Dance Of Death!','KILL THEM ALL!!','MASSACRE!!','Beautifull!!','No Time To Die !!!','Sensational!!','WonderFull!!!','Gorgeous!','NO MERCY','Excellent!!!','Mesmerizing!!','Quick And Efficient!','HEAVY!!','CumberSome!!!','So Bulky!','Overwhelming!!','OVERKILL!!!','In Trance State!','Big Flow!!','High-intensity!!!','Invincible!!','Overly Strong!!!','Amazing!!!','OverPowering!','Hypnotic!!','Stupefying!!','You\'re a GOD!!','Beyond the Limits!','You\'re a MONSTER!!', 'CRAZY!!!', 'IMPOSSIBLE!!!','Take My Virginity!!','DIVINE !!']



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// SONG
    themeSong = this.sound.add('theme',{volume: 0.08});
    gameoverSong = this.sound.add('gameover',{volume: 0.08});
    coinImpact = this.sound.add('coinImpact',{volume: 1});
    swordImpact = this.sound.add('swordImpact',{volume: 0.04});
    swordImpact2 = this.sound.add('swordImpact2',{volume: 0.012});
    swordImpactEnemies = this.sound.add('ImpactEnemies',{volume: 0.24});
    swordAir = this.sound.add('air',{volume: 0});
    themeSong.loop = true ;
    gameoverSong.stop();
    //themeSong.play();



   /// OBJECT
    skyBg = this.add.tileSprite(0, 0, 404, 482, 'sky').setScale(2); //image ciel
   
    ////////////////////////////////////////////////////////////////////

    // LEVEL
    
    const map = this.make.tilemap({ key : 'tiles'})                                                    // TILED level
    const tileset = map.addTilesetImage('map','forest');

    const ClimbTile = map.createLayer('VerticalClimb', tileset, -200, 0)
    const ResetTile = map.createLayer('Reset', tileset, -200, 0)
    const DieTile = map.createLayer('DieTiles', tileset, -200, 0)
    const Spawner = map.createLayer('Spawners', tileset, -200, 0)
    const BackGround = map.createLayer('Fond', tileset, -200, 0)
    const newPlatform = map.createLayer('Ground', tileset, -200, 0)
    CrossPlatform = map.createLayer('CrossGround', tileset, -200, 0)
    const Decor = map.createLayer('Decors', tileset, -200, 0)
    
    this.sys.animatedTiles.init(map);

    ClimbTile.setCollisionByProperty({collides : true})
    ResetTile.setCollisionByProperty({collides : true})
    DieTile.setCollisionByProperty({collides : true})
    Spawner.setCollisionByProperty({collides : true})
    newPlatform.setCollisionByProperty({collides : true})
    CrossPlatform.setCollisionByProperty({collides : true})

    ClimbTile.setScale(2);
    ClimbTile.setVisible(false);
    ResetTile.setScale(2);
    DieTile.setScale(2);
    Spawner.setScale(2);
    Spawner.setVisible(false);
    BackGround.setScale(2);
    newPlatform.setScale(2);
    CrossPlatform.setScale(2);
    Decor.setScale(2);
    Decor.setDepth(1);
    
    CrossPlatform.faceLeft = false;
    CrossPlatform.faceRight = false;
    CrossPlatform.faceBottom = false;

    Spawner.setData('Activate', false);


    // Fond.setScale(1.5)

    // console.log(CrossPlatform);

    ////////////////////////////////////////////////////////////////////

    // var sol1 = this.add.sprite(300, 400, 'ground');//image sol
    // var sol2 = this.add.sprite(511, 550, 'ground');//image sol
    // var sol3 = this.add.sprite(900, 600, 'ground');//image sol

    enemy1Spawn = this.add.image(1600, 1100, 'spawner').setVisible(false);              //spawn enemy
    enemyCrossBowSpawn = this.add.image(700, 300, 'spawner').setVisible(false);         //spawn enemy
    boxSpawn = this.add.group({
        key : 'box',
        visible : false,
    });           

    healthBar = this.add.rectangle(0,0,120,10,0xB14F37).setStrokeStyle(2, 0xFFFFFF);    //healthbar
    healthBar.setDepth(2);

    specialBar = this.add.rectangle(0,0,120,10,0xFDCA7F);                               //specialbar
    specialBar.setDepth(2);

    spebar = this.add.image(0, 0,'spebar').setScale(2).setDepth(2);
    

    Coin = this.physics.add.group({                                                     // Coin
        //key :'piecette',
        setXY:{x: -400, y :30},
        visible : false,
    });

    colideATKEnemy = this.physics.add.group({allowGravity : false})                     // collide attack enemies

    Arrow = this.physics.add.group({allowGravity : false})                              // Arrow 

    DestroyArrow = this.add.sprite(0,0,'sfx').setScale(2);                      // Destroy Arrow
    
    rageCloud = this.add.sprite(0,0,'sfx').setScale(2);
    rageCloud.setDepth(1);

    oldfilter = this.add.sprite(600,1150,'oldTvFilter').setScale(0.4).setDepth(3);
    oldfilter.alpha = 0.1
    //console.log(oldfilter);

    hittableObject = this.physics.add.group({immovable: true})                          // enemy and other...

    controlHelp = this.add.sprite(360,1260,'controlHelp').setScale(1.5).setDepth(2);    // controlHelp

    player = this.physics.add.sprite(600, 1150,'hero').setScale(2);                     // player
    player.body.setSize(25, 58)                                         
    player.setData('health', 10)
    player.setData('special', 6)
    player.setData('Guard', false);
    player.setData('Climb', false);
    // player.setData('Expulse', false);
    player.setData('Eject', 0);
    player.body.checkCollision.up = false;
    
    //console.log(player.body.touching);

    colideATK = this.add.rectangle(-800,0,100,100,0xB14F37)                                // collision attack final
    this.physics.add.existing(colideATK);
    colideATK.setVisible(false)
    colideATK.body.allowGravity = false;

    slashAtk = this.add.sprite(-1000,-1000,'slash').setScale(4);                                // img Slash
    slashAtk.setDepth(1);


    spawnDetector = this.add.rectangle(1300,1000,20,350,0xB14F37);                      // Spawn Detector
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

    text = this.add.text(0,0, 'version : O.40 | 14.11.22' , {fontFamily : 'PixelFont'}); 
    personalBestText = this.add.text(0,0,'YOUR BEST : 0',{ fontFamily : 'PixelFont'})
    scoreText = this.add.text(0,0, 'SCORE : 0',{ fontFamily : 'PixelFont'})
    gameOverText = this.add.text(0,0, 'GAME OVER \n score : 0 \n press any to restart', { fontFamily : 'PixelFont', fontSize : '60px'});
    comboText = this.add.text(0,0,'COMBO X0',{ fontFamily : 'PixelFont'});
    funText = this.add.text(0,0,'',{ fontFamily : 'PixelFont'});
    gameOverText.setDepth(-2);
    text.setDepth(2);
    scoreText.setDepth(2);
    personalBestText.setDepth(2);
    comboText.setDepth(2);

    // var tween = this.tweens.add({
    //     targets : player,
    //     ease: 'Power1',
    //     duration: 9000,
    //     x : 5,
    //     y : 5,
    //     yoyo : true,
    //     repeat: -1

    // })
    //text.setFontSize(text.fontSize - 2);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // CAMERA

    // this.cameras.main.startFollow(player);
    // this.cameras.main.setZoom(4);

    cameraPlayer = this.cameras.main.startFollow(player).setZoom(4);
    // cameraPlayer.main.setZoom(4);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COLLISIONS

    this.physics.add.collider(colideATK, Arrow, function(atk,arrow){
        DestroyArrow.setY(player.y);
        if(player.flipX === true){DestroyArrow.setX(player.x -100)}
        if(player.flipX === false){DestroyArrow.setX(player.x +100)}
        DestroyArrow.anims.play('breackArrow', true);
        slashAtk.setY(player.y)
        if(player.flipX === true){slashAtk.setX(player.x -100)}
        if(player.flipX === false){slashAtk.setX(player.x +100)}

        slashAtk.anims.play('slashed', true)
        slashAtk.rotation = Phaser.Math.Between(0,2);

        arrow.setY(0)
    })
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
            coinImpact.play();

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
        this.physics.add.collider(Coin, CrossPlatform)

        this.physics.add.collider(player, newPlatform, function(plyr,pltfrm){       //collision player + platform tiles
           // playerCanFall = true;
           player.data.list.Climb = false;

            if(pltfrm.faceLeft && plyr.body.velocity.y != 0|| 
                pltfrm.faceRight && plyr.body.velocity.y != 0){
                    playerInGround = false;
                }
                else{
                attackintheair = false;
                playerInGround = true;
            }
        })
        this.physics.add.overlap(player, CrossPlatform, function(plyr,pltfrm){       //overlap player + CrossPlatform tiles
            pltfrm.faceLeft = false;
            pltfrm.faceRight = false;
            pltfrm.faceBottom = false;
        })

        this.physics.add.collider(player, CrossPlatform, function(plyr,pltfrm){       //collision player + CrossPlatform tiles
            attackintheair = false;
            playerInGround = true;
            player.data.list.Climb = false;
        });

        this.physics.add.collider(ResetTile, player, function(theplayer, reset){   // collision reset et joueur 
            hittableObject.children.entries.length = 0
            //console.log('reset');

            reset.collideDown = false
            reset.collideLeft = false
            reset.collideRight = false
            reset.collideUp = false
        });

        this.physics.add.collider(Spawner, spawnDetector, function(detector, spawn){    // spawn collider
            
            spawn.collideDown = false
            spawn.collideLeft = false
            spawn.collideRight = false
            spawn.collideUp = false

            spawnCounter ++;

            detector.body.position.x = player.body.position.x +700
            detector.body.position.y = player.body.position.y -150

            //console.log(spawnCounter);
            //console.log(spawn);
            // console.log(detector);
            detector.body.checkCollision.none = true
            setTimeout(()=>{detector.body.checkCollision.none = false},400)
            switch(spawnCounter){
                case 1: createEnemies(detector,'SpearMan'); break;
                case 2: createEnemies(detector,'RunMan'); break;
                case 3: createEnemies(detector,'Enemy1'); break;
                case 4: createEnemies(detector,'box'); break;
                case 5: createEnemies(detector,'CrossBow'); break;
                case 6: createEnemies(detector,'box'); break;
                case 7: createEnemies(detector,'Enemy1'); break;
                case 8: createEnemies(detector,'box'); break;
                case 9: createEnemies(detector,'PoleAxe'); break;
                case 10: createEnemies(detector,'Assassin'); break;
                case 11: spawnCounter = 0; detector.body.checkCollision.none = true; break;
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

        this.physics.add.overlap(hittableObject, CrossPlatform, function(enemy, pltfrm){     // collision entre attaque et boites 
            pltfrm.faceLeft = false;
            pltfrm.faceRight = false;
            pltfrm.faceBottom = false;
            pltfrm.faceUp = true;
        });
        
        this.physics.add.collider(hittableObject, CrossPlatform, function(enemy,pltfrm){       //collision enemy + CrossPlatform tiles
           //enemy.data.list.stopMove = true
           //console.log('enemy.data.list.stopMove');
        })

        this.physics.add.collider(hittableObject, newPlatform, function(htblobjct, Platform){})   //collision Enemy + platform 

        this.physics.add.overlap(                                                                 //overlap player climbTile
            player,
            ClimbTile,
            function onOverlap(player, tile) {
                //console.log("overlap", tile.x, tile.y);
                if(player.data.list.Climb === true){

                    counterMovePlayer = 53
                    player.anims.play('climb', true)
                    player.setVelocityY(-200)

                    setTimeout(()=>{
                    counterMovePlayer = 0
                    ,0})
                }
            },
            function process(player, tile) {
              return tile.collides;
            }
          );


        this.physics.add.collider(DieTile, hittableObject, function(enemy, die){
            enemy.data.list.health = 0;
            //console.log(enemy);
        });

        this.physics.add.collider(DieTile, player, function(plyr, die){
            plyr.data.list.health = 0;
            counterMovePlayer = 28;
            //console.log(plyr);
        });
        
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    // ENTREES CLAVIER
    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    leftkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    rightkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    upkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    //touchesClavier = this.input.keyboard.addKeys('Q, Z, S, D'); //direction
    touchesAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); //attack
    touchesGuard = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Guard

    var tornadoSlashLeft = this.input.keyboard.createCombo([83, 68, 74], {resetOnMatch:true, maxKeyDelay:700}); //300ms pour taper le combo, sinon se reinitialise
    var tornadoSlashRight = this.input.keyboard.createCombo([83, 81, 74], {resetOnMatch:true, maxKeyDelay:700}); 

    var UltraSlashLeft = this.input.keyboard.createCombo([81, 83, 68, 74], {resetOnMatch:true, maxKeyDelay:700}); //300ms pour taper le combo, sinon se reinitialise
    var UltraSlashRight = this.input.keyboard.createCombo([68, 83, 81, 74], {resetOnMatch:true, maxKeyDelay:700}); 

    var ShieldAttackLeft = this.input.keyboard.createCombo([83,68,73], {resetOnMatch:true, maxKeyDelay:700}); 
    var ShieldAttackRight = this.input.keyboard.createCombo([83, 81, 73], {resetOnMatch:true, maxKeyDelay:700}); 

    var keycomboinput = this.input.keyboard.on('keycombomatch', function(combo){ //verification du secialAtk entrée

        if(playerInGround === true){
            if(combo.keyCodes == tornadoSlashRight.keyCodes){
                if(canShoryu === true){
                    if(player.data.list.special >= 1){
                        counterMovePlayer = 32;
                        tornadoSlash();
                    }
                }
                // console.log('tsr');
            }
            if(combo.keyCodes == tornadoSlashLeft.keyCodes){
                if(canShoryu === true){
                    if(player.data.list.special >= 1){
                        counterMovePlayer = 32;
                        tornadoSlash();
                    }
                }
                // console.log('tsl');
            }
            if(combo.keyCodes == UltraSlashRight.keyCodes){
                if(player.data.list.special >= 3){
                    counterMovePlayer = 33;
                    UltraSlash();
                }
                // console.log('Usr');
            }
            if(combo.keyCodes == UltraSlashLeft.keyCodes){
                if(player.data.list.special >= 3){
                    counterMovePlayer = 33;
                    UltraSlash();
                }
                // console.log('Usl');
            }
            if(combo.keyCodes == ShieldAttackRight.keyCodes){
                if(player.data.list.special >= 2){
                    shieldTackle();
                    counterMovePlayer = 36;
                }
                // console.log('Sar');
            }
            if(combo.keyCodes == ShieldAttackLeft.keyCodes){
                if(player.data.list.special >= 2){
                    shieldTackle();
                    counterMovePlayer = 36;
                }
                // console.log('Sal');
            }
        }else{
            if(combo.keyCodes == tornadoSlashRight.keyCodes){
                if(player.data.list.special >= 2){
                    counterMovePlayer = 34; //35 apparement
                    attackintheair = true;
                    powerAttackJump();
                }
                // console.log('paj');
            }
            if(combo.keyCodes == tornadoSlashLeft.keyCodes){
                if(player.data.list.special >= 2){
                    counterMovePlayer = 34; //35 apparement
                    attackintheair = true;
                    powerAttackJump();
                }
                // console.log('paj');
            }
            if(combo.keyCodes == UltraSlashRight.keyCodes){
                if(player.data.list.special >= 3){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
                // console.log('Usr');
            }
            if(combo.keyCodes == UltraSlashLeft.keyCodes){
                if(player.data.list.special >= 3){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
                // console.log('Usl');
            }
        }
        
        // if(playerInGround === true){
        //     if(combo.keyCodes[0] === 72){
        //         if(player.data.list.special >= 2){
        //             console.log('enculé de ta race');
        //             shieldTackle();
        //             counterMovePlayer = 36;
        //         }

        //     }
        //     if(combo.keyCodes[0] === 83){
        //             if(player.data.list.special >= 1){
        //                 counterMovePlayer = 32;
        //                 tornadoSlash();
        //             }
        //     }
        //     if(combo.keyCodes[0] === 68 || combo.keyCodes[0] === 81){
        //         if(player.data.list.special >= 3){
        //             counterMovePlayer = 33;
        //             UltraSlash();
        //         }
        //     }
        // }else{
        //     if(combo.keyCodes[0] === 83){
        //         if(player.data.list.special >= 2){
        //             counterMovePlayer = 34; //35 apparement
        //             attackintheair = true;
        //             powerAttackJump();
        //         }
        //     }
        //     if(combo.keyCodes[0] === 68 || combo.keyCodes[0] === 81){
        //         if(player.data.list.special >= 3){
        //             counterMovePlayer = 33;
        //             UltraSlash();
        //         }
        //     }
        // }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////

    // GAMEPAD

    gamepadAttack = false;
    gamepadJump = false;
    theGamePad = this.input.gamepad.on('down', function(pad, button, index){
        theGamePad = pad
        text.setText('Playing with : ' + pad.id);

        if(pad._RCBottom.pressed && playerInGround === true && counterMovePlayer === 0){ //jump
            gamepadJump = true;
        }
        if(pad._RCLeft.pressed){    //Attack
            // gamePadCombo = gamePadCombo + 'A';
            gamePadCombo.push(74);
            gamepadAttack = true;
        }
        if(pad._RCTop.pressed){    //Protect
            // gamePadCombo = gamePadCombo + 'P';
            gamePadCombo.push(73);
            //gamepadAttack = true;
        }
        if(pad._LCTop.pressed){  //up
            gamePadCombo.push('H');
        }
        if(pad._LCBottom.pressed){  //down
            // gamePadCombo = gamePadCombo + 'B';
            gamePadCombo.push(83);
        }
        if(pad._LCRight.pressed){   //Right
            // gamePadCombo = gamePadCombo + 'D';
            gamePadCombo.push(81);
        }
        if(pad._LCLeft.pressed){    //Left
            // gamePadCombo = gamePadCombo + 'G';
            gamePadCombo.push(68);
        }
        //console.log(keycomboinput._events);
        console.log(pad);
        // console.log(pad.);
        let checker = (arr, target) => target.every(v => arr.includes(v));

        if(playerInGround === true){
            if(checker(gamePadCombo, tornadoSlashLeft.keyCodes) == true){
                if(canShoryu === true){
                    if(player.data.list.special >= 1){
                        counterMovePlayer = 32;
                        tornadoSlash();
                    }
                }
            }
            if(checker(gamePadCombo, tornadoSlashRight.keyCodes) == true){
                if(canShoryu === true){
                    if(player.data.list.special >= 1){
                        counterMovePlayer = 32;
                        tornadoSlash();
                    }
                }
            }
            if(checker(gamePadCombo, UltraSlashLeft.keyCodes) == true){
                if(player.data.list.special >= 2){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
            }
            if(checker(gamePadCombo, UltraSlashRight.keyCodes) == true){
                if(player.data.list.special >= 2){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
            }
            if(checker(gamePadCombo, ShieldAttackLeft.keyCodes) == true){
                if(player.data.list.special >= 2){
                    shieldTackle();
                    counterMovePlayer = 36;
                }
            }
            if(checker(gamePadCombo, ShieldAttackRight.keyCodes) == true){
                if(player.data.list.special >= 2){
                    shieldTackle();
                    counterMovePlayer = 36;
                }
            }
        }else{
            if(checker(gamePadCombo, tornadoSlashLeft.keyCodes) == true){
                if(player.data.list.special >= 2){
                    counterMovePlayer = 34; //35 apparement
                    attackintheair = true;
                    powerAttackJump();
                }
            }
            if(checker(gamePadCombo, tornadoSlashRight.keyCodes) == true){
                if(player.data.list.special >= 2){
                    counterMovePlayer = 34; //35 apparement
                    attackintheair = true;
                    powerAttackJump();
                }
            }
            if(checker(gamePadCombo, UltraSlashLeft.keyCodes) == true){
                if(player.data.list.special >= 3){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
            }
            if(checker(gamePadCombo, UltraSlashRight.keyCodes) == true){
                if(player.data.list.special >= 3){
                    player.data.list.special++
                    counterMovePlayer = 33;
                    UltraSlash();
                }
            }
        }
        setTimeout(()=>{gamePadCombo = []},400);
    }, this);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //TOUCH SCREEN

    // TouchLeft = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    // TouchRight = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    // TouchUp = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    // TouchDown = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    // TouchJump = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    // TouchAttack = this.add.rectangle(0,0,60,60,0xB14F37).setStrokeStyle(2, 0xFFFFFF).setDepth(3).setInteractive();
    
    // // TouchLeft.setDepth(3);
    // // TouchLeft.setInteractive();
    // TouchJump.on('pointerdown', function (){                                                        //jump
    //     //jumpAction();
    //     gamepadJump = true;
    //     console.log('tap');
    // },this);
    // TouchRight.on('pointerdown', function (){                                                       //right
    //     console.log(TouchLeft.input);
    //     theGamePad.right = true
    //     theGamePad.left = false
    //     gamePadCombo = gamePadCombo + 'D';

    //     console.log('tap');
    // },this);

    // TouchLeft.on('pointerdown', function (){                                                        //left
    //     console.log(TouchLeft.input);
    //     gamepadLeft = true
    //     theGamePad.right = false
    //     gamePadCombo = gamePadCombo + 'G';

    //     console.log('tap');
    // },this);

    // TouchUp.on('pointerdown', function (){                                                          //up
    //     gamePadCombo = gamePadCombo + 'H';
    //     console.log('up');
    // },this);

    // TouchDown.on('pointerdown', function (){                                                        //down
        
    //     gamePadCombo = gamePadCombo + 'B';
    //     console.log('down');
    // },this);

    // TouchAttack.on('pointerdown', function (){                                                      //atk
    //     console.log(TouchLeft.input);
    //     gamepadAttack = true
    //     console.log('tap');
    //     gamePadCombo = gamePadCombo + 'A';
    // },this);

    // // TouchRight.on('pointerover', function (){
    // //     console.log(TouchLeft.input);
    // //     theGamePad.right = true
    // //     console.log('tap');
    // // },this);
    // TouchLeft.on('pointerout', function (){
    //     gamepadLeft = false;
    //     // console.log(TouchLeft.input);
    //     console.log('up');
    // },this);
    // TouchRight.on('pointerout', function (){
    //     theGamePad.right = false
    //     // console.log(TouchLeft.input);
        
    //     console.log('up');
    // },this);

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
    });
    firstAtk = this.anims.create({
        key: 'attackOne',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [ 0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6]}),
        frameRate: 27,
        //repeat: -1
    });
    this.anims.create({
        key: 'attackTwo',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]}),
        frameRate: 24,
        //repeat: -1
    });
    this.anims.create({
        key: 'attackThree',
        frames: this.anims.generateFrameNumbers('heroAttackthree',{frames: [0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7]}),
        frameRate: 19,
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
        // frames: this.anims.generateFrameNumbers('shoryu',{frames: [0, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]}),
        frames: this.anims.generateFrameNumbers('shoryu',{frames: [0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 11, 11]}),
        frameRate: 12,
        repeat : -1,
    });
    this.anims.create({
        key: 'shieldAttack',
        frames: this.anims.generateFrameNumbers('shieldTackle',{frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 12, 12, 12, 12]}),
        frameRate: 25,
    });
    this.anims.create({
        key: 'specialAirSlash',
        frames: this.anims.generateFrameNumbers('specialairslash',{frames: [0, 1, 2, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]}),
        frameRate: 16,
        repeat : -1,
    });
    this.anims.create({
        key: 'ultra',
        frames: this.anims.generateFrameNumbers('ultimate',{frames: [0, 1, 23, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 59, 59, 59, 59, 59]}),
        frameRate: 25,
    });
    // this.anims.create({
    //     key: 'pushBox',
    //     frames: this.anims.generateFrameNumbers('pushBox',{frames: [0, 1, 2, 3, 4, 5]}),
    //     frameRate: 8,
    // });
    this.anims.create({
        key: 'climb',
        frames: this.anims.generateFrameNumbers('heroClimb',{frames: [0, 1, 3, 4, 5, 5, 6, 6]}),
        frameRate: 6,
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
        key: 'stanceSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [0]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'stanceAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [0]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'stanceRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [0]}),
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
    this.anims.create({
        key: 'walkSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
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
        key: 'walkbackSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'attackEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 5, 5, 6, 7, 8, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0]}),
        frameRate: 15,
    });
    this.anims.create({
        key: 'attackCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [ 10, 10, 10, 10, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 8, 8, 9, 9]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'attackPoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [ 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 11, 11, 11, 12, 13, 14, 15, 16, 17, 17, 0, 0, 0]}),
        frameRate: 15,
    })
    this.anims.create({
        key: 'attackSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [ 0, 5, 5, 5, 6, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0]}),
        frameRate: 15,
    })
    this.anims.create({
        key: 'attackAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [ 5, 11, 11, 11, 12, 13, 5, 5, 5, 5, 5, 0, 0, 0]}),
        frameRate: 10,
    })
    this.anims.create({
        key: 'attackTwoAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [ 15, 16, 16, 16, 17, 17, 17, 18, 19, 19, 15]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'attackRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [ 5, 5, 6, 6, 7, 7, 7, 8, 9, 10, 10, 10, 0, 0, 0]}),
        frameRate: 10,
    })
    this.anims.create({
        key: 'knockbackEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [ 10, 11, 11, 11, 11, 11, 11, 11, 0]}),
        frameRate: 9,
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
    this.anims.create({
        key: 'knockbackSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [9, 10, 10, 10, 10, 10, 10, 10, 0]}),
        frameRate: 9,
    });
    this.anims.create({
        key: 'knockbackAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [20, 21, 21, 21, 21, 21, 21, 21, 0]}),
        frameRate: 9,
    });
    this.anims.create({
        key: 'knockbackRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [11, 12, 12, 12, 12, 12, 12, 12, 0]}),
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
        key: 'fallSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'fallAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'fallRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]}),
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
    this.anims.create({
        key: 'ejectSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'ejectAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'ejectRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulseEnemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [15 ,16, 16,16, 16,16, 16, 15, 15]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulseCrossBow',
        frames: this.anims.generateFrameNumbers('theEnemyCrossBow',{frames : [20, 21, 21, 21, 21, 21, 21, 20, 20]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulsePoleAxe',
        frames: this.anims.generateFrameNumbers('theEnemyPoleAxe',{frames : [20, 21, 21, 21, 21, 21, 21, 20, 20]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulseSpearMan',
        frames: this.anims.generateFrameNumbers('theEnemySpearMan',{frames : [14, 15, 15, 15, 15, 15, 15, 14, 14]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulseAssassin',
        frames: this.anims.generateFrameNumbers('theEnemyAssassin',{frames : [25, 26, 26, 26, 26, 26, 26, 25, 25]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'expulseRunMan',
        frames: this.anims.generateFrameNumbers('theEnemyRunMan',{frames : [16, 17, 17, 17, 17, 17, 17, 16, 16]}),
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
        key: 'breackArrow',
        frames: this.anims.generateFrameNumbers('sfx',{frames: [1, 2, 3, 4, 5, 6, 7, 8, 0]}),
        frameRate: 10,
    });
    this.anims.create({
        key: 'slashedGuard',
        frames: this.anims.generateFrameNumbers('slashGuard',{frames: [0, 1, 2, 3, 4]}),
        frameRate: 30,
    });
    this.anims.create({
        key: 'rage',
        frames: this.anims.generateFrameNumbers('sfx',{frames: [9, 10, 11, 12]}),
        frameRate: 15,
        repeat: -1
    });
    // this.anims.pauseAll();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE ENEMIES

    //createEnemies(enemy1Spawn,'RunMan');
    // createEnemies(enemy1Spawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'Enemy1');
    // createEnemies(enemyCrossBowSpawn,'box');
    // createEnemies(enemyCrossBowSpawn,'CrossBow');
    // createEnemies(boxSpawn,'box');
    
    // for(var i = 0;i < 1; i++){
    //     setTimeout(()=>{createEnemies(enemy1Spawn, 'Enemy1')},9000 + (i * 7000))
    // }
   
    // for(var i = 0;i < 4; i++){
    //     setTimeout(()=>{createEnemies(enemy1Spawn,'CrossBow');},9000 + (i * 7000))
    // }

    // for(var i = 0;i < 2; i++){
    //     setTimeout(()=>{createEnemies(enemySpawn,'box');},9000 + (i * 7000))
    // }

    //console.log(localStorage);


    // if(GameOver === true){
        // setTimeout(()=>{
        //     this.registry.destroy(); // destroy registry
        //     this.events.off(); // disable all active events
        //     this.scene.restart(); // restart current scene
        //     spawnCounter = 0;
        //     Score = 0;
        // },9000)
    // }
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////    UPDATE 

function update(time, delta){

// if(GameOver === false){
    //BACKGROUND AND TEXT
        
    skyBg.x = player.body.position.x;                                                                // position du ciel
    skyBg.y = player.body.position.y;                                                                // position du ciel
    skyBg.tilePositionX += 0.5;
    text.x = player.body.position.x - 345;                                                           // position text
    text.y = player.body.position.y + 260;
    healthBar.x = player.body.position.x - 270;                                                      // position healthbar
    healthBar.y = player.body.position.y - 140;
    specialBar.x = player.body.position.x - 270;                                                     // position healthbar
    specialBar.y = player.body.position.y - 120;
    spebar.x = player.body.position.x - 260;
    spebar.y = player.body.position.y - 120;
    scoreText.x = player.body.position.x + 260;                                                      // position Score
    personalBestText.x = player.body.position.x + 60;                                                // position Score
    scoreText.y = player.body.position.y -160;
    personalBestText.y = player.body.position.y -160;
    comboText.x = player.body.position.x - 999;
    comboText.y = player.body.position.y - 110;
    funText.x = player.body.position.x - 999;
    funText.y = player.body.position.y - 80;

    rageCloud.x = player.body.position.x +18
    rageCloud.y = player.body.position.y +46
    oldfilter.x = player.body.position.x +20
    oldfilter.y = player.body.position.y +46

    controlHelp.x = player.body.position.x  + 25                                                    // position controlHelp
    controlHelp.y = player.body.position.y + 50
    //controlHelp.alpha = 2.150 - ((player.body.position.x / 1000) * 2)                                                // opacity // control help
    // console.log((player.body.position.x / 1000)-(player.body.position.x - 1));
    //console.log(player.body.position.x);

    healthBar.width = player.data.list.health * 12;
    specialBar.width = player.data.list.special * 22;

    scoreText.setText('SCORE : '+ Score);                                                            // maj score
    gameOverText.setText('   GAME OVER \n   score : '+ Score + '\npress "J" to restart');                                                           // maj score
    personalBestText.setText('YOUR BEST : '+ personalBest);                                          // maj score
    comboText.setText('COMBO X '+ comboValue);                                                       // maj combo
    gameOverText.x = player.body.position.x - 260
    gameOverText.y = player.body.position.y
    spawnDetector.body.velocity.x = player.body.velocity.x ;
    spawnDetector.body.velocity.y = player.body.velocity.y ;
    funText.setText(''+ messageFunTextList[comboValue]);


    if(comboValue >= 1){
        comboText.x = player.body.position.x + 150;
        funText.x = player.body.position.x + 150;
    }
    //if(comboValue <= 9){messageFunText =''; }
    if(comboValue <= 14){                                                                             //RAGEMODE
        rageMode = false;
        rageCloud.setVisible(false);
        specialBar.fillColor = 16632447
    }
    //if(comboValue >= 10){messageFunText = 'Nice !'; }
    if(comboValue >= 15){                                        
        rageMode = true;
        rageCloud.setVisible(true);
        specialBar.fillColor = 11620151;
        //messageFunText ='"RAGE !!"';
        //console.log(player);
    }
    countComboFunText = 10;
    
    // if(comboValue >= 20){funText.setText(''+'Good !'); }
    // if(comboValue >= 30){funText.setText(''+'Incredible !!!'); }
    // if(comboValue >= 40){funText.setText(''+'Marvelous !!!'); }
    // if(comboValue >= 50){funText.setText(''+'Oh My God !!!'); }
    // if(comboValue >= 60){funText.setText(''+'Unstoppable !'); }
    // if(comboValue >= 70){funText.setText(''+'No Mercy !'); }
    // if(comboValue >= 80){funText.setText(''+'Great !!'); }
    // if(comboValue >= 90){funText.setText(''+'Stupefying !!'); }
    // if(comboValue >= 100){funText.setText(''+'You\'re a GOD !'); }
    // if(comboValue >= 150){funText.setText(''+'Beyond the Limits !'); }
    // if(comboValue >= 200){funText.setText(''+'You\'re a MONSTER !'); }
    // if(comboValue >= 300){funText.setText(''+'CRAZY !!!!'); }
    // if(comboValue >= 400){funText.setText(''+'IMPOSSIBLE !'); }
    // if(comboValue >= 500){funText.setText(''+'Take My Virginity !!'); }
    
    // TouchLeft.x = player.body.position.x - 300;                                                           // position touch
    // TouchLeft.y = player.body.position.y + 160;
    // TouchRight.x = player.body.position.x - 180;                                                           // position touch
    // TouchRight.y = player.body.position.y + 160;
    // TouchUp.x = player.body.position.x - 240;                                                           // position touch
    // TouchUp.y = player.body.position.y + 100;
    // TouchDown.x = player.body.position.x - 240;                                                           // position touch
    // TouchDown.y = player.body.position.y + 220;
    // TouchJump.x = player.body.position.x + 300;                                                           // position touch
    // TouchJump.y = player.body.position.y + 220;
    // TouchAttack.x = player.body.position.x + 200;                                                           // position touch
    // TouchAttack.y = player.body.position.y + 160;

    
    // spawnReActivator.body.velocity.x = player.body.velocity.x ;
    // spawnReActivator.body.velocity.y = player.body.velocity.y ;
    // spawnDetector.y = player.body.position.y;
    if(startGame === true){
        controlHelp.setVisible(true)
        controlHelp.setFrame(8);
    }
    else{

     if(player.body.position.x < 950){
        controlHelp.alpha = 2.150 - ((player.body.position.x / 1000) * 2)                                                // opacity // control help
        controlHelp.setVisible(true)
        controlHelp.setFrame(0);
     }
     else if(player.body.position.x > 1050 && player.body.position.x < 2030){
        controlHelp.alpha = 1;
        controlHelp.setVisible(true)
        controlHelp.setFrame(1);
     }
     else if(player.body.position.x > 2040 && player.body.position.x < 2600){
        controlHelp.setVisible(true)
        controlHelp.setFrame(3);
     }
     else if(player.body.position.x > 2601 && player.body.position.x < 3000){
        controlHelp.setVisible(true)
        controlHelp.setFrame(4);
     }
     else if(player.body.position.x > 3100 && player.body.position.x < 4000){
        controlHelp.setVisible(true)
        controlHelp.setFrame(2);
     }
     else if(player.body.position.x > 4150 && player.body.position.x < 5374){
        controlHelp.setVisible(true)
        controlHelp.setFrame(5);
     }
     else if(player.body.position.x > 5600 && player.body.position.x < 6374){
        controlHelp.setVisible(true)
        controlHelp.setFrame(7);
     }
     else{controlHelp.setVisible(false)}
    }


    //ENEMY UPDATE
    for(var i = 0; i < hittableObject.children.entries.length; i++){
        if(hittableObject.children.entries[i] != undefined && hittableObject.children.entries[i].data.list.name === 'EnemyOne'){
            
            var currentEnemy = hittableObject.children.entries[i]; 

            //COLLISION Enemy + player

            this.physics.add.collider(currentEnemy, player, function(htblobjct, plyr){                  // COLLISIONS
            
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

            this.physics.add.overlap(currentEnemy, player, function(htblobjct, plyr){               // overlap player + enemies
                if(counterMovePlayer != 35){
                    if(htblobjct.data.list.AtkCollide === true){                                        // collision Player Guard                     
                        if(plyr.data.list.Guard === true){
                            swordImpact2.play();
                            player.data.list.special = player.data.list.special - 1;
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
                            swordImpact.play();
                            counterMovePlayer = 28
                            plyr.data.list.health--;
                            htblobjct.data.list.AtkCollide = false;

                        }
                    }else{
                        //counterMove = 28
                    }
                }
            });

            ////////////////////////////////////////////////////////////////////////////////////////////
            
            //COLLISION Attack + enemy

            this.physics.overlap(currentEnemy, colideATK, collisionAtkEnemies,null,this)

            //////////////////////////////////////////////////////////////////////////////////////////////

        let rdmNbr = currentEnemy.data.list.randomValue / 2;

            if(currentEnemy.data.list.stopMove === false){
                if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) >= 100 + rdmNbr &&             // walk enemies
                currentEnemy.data.list.AttackIsFinish === true){

                    currentEnemy.data.list.CounterMove = 1; 
                    currentEnemy.data.list.EnemyIsAttack = true; 
                }
            }else{
                currentEnemy.data.list.EnemyIsAttack = true;
                //currentEnemy.anims.play('stance'+ currentEnemy.data.list.type, true)
                //console.log('eh beh'+ currentEnemy.data.list.CounterMove);
            }

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) < 400 &&                         // attack CrossBow
            Phaser.Math.Distance.BetweenPoints(currentEnemy,player) > 126 &&
            currentEnemy.data.list.AttackIsFinish === true &&
            currentEnemy.data.list.type === 'CrossBow'){

                currentEnemy.data.list.CounterMove = 2; 
            }

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) < 200 &&                         // attack 2 Assassin
            Phaser.Math.Distance.BetweenPoints(currentEnemy,player) > 190 &&
            currentEnemy.data.list.AttackIsFinish === true &&
            currentEnemy.data.list.EnemyIsAttack === true && 
            currentEnemy.data.list.type === 'Assassin'){

                currentEnemy.data.list.AttackIsFinish = false
                currentEnemy.data.list.EnemyIsAttack = false
                currentEnemy.data.list.CounterMove = 6;
            }

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) <= 90 + rdmNbr &&                        // action enemies
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

            //if(currentEnemy.data.list.CounterMove != 28){        // action enemies
                if(currentEnemy.data.list.health <= 0 ){
                    if(enemyCanDie === true){
                        currentEnemy.data.list.CounterMove = 4
                    }else{
                        // currentEnemy.data.list.health = 0
                    }
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
                    case 6: enemyAttackTwo(currentEnemy); break;
                    case 7:
                    default:
                        //do nothing
                        break;
                }
                
                if(currentEnemy.data.list.EnemyIsDie === true)                                              // Delete Enemies 
                {
                    //console.log(currentEnemy.data.list.randomValue);
                    for(let i = 0;i < currentEnemy.data.list.randomValue / 3; i++){
                        createCoin(currentEnemy)
                    }
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
            
            //}
            
        }
        // else if(hittableObject.children.entries[i].data.list.name === 'slash'){                         //img attack slash
        //     hittableObject.children.entries[i].body.checkCollision.none = true;
        //     if(player.flipX === true){
        //         hittableObject.children.entries[i].x = player.x - 90
        //         hittableObject.children.entries[i].y = player.y
        //     }else{
        //         hittableObject.children.entries[i].x = player.x + 90
        //         hittableObject.children.entries[i].y = player.y
        //     }
        // }

        // else{hittableObject.children.entries[i] = [];} 
    }
    //console.log(counterMovePlayer);
    //console.log(player.data.list.Eject);
    // console.log(currentEnemy);
    //console.log(Arrow);
    //console.log(Phaser.Math.Distance.BetweenPoints(hittableObject.children.entries[0],player));
    //console.log(enemyMoveDetection.children.entries[0]);
    //enemyMoveDetection.children.entries[0].body.destroy()
    //console.log(Arrow);
    //console.log(PlayerTouchEnemy);
    //console.log(colideATK2);
    //console.log(playerCanFall);
    //console.log(returnRandomNumber(10, 20));
    //console.log('AtkCollide : '+ hittableObject.children.entries[0].data.list.AtkCollide);
    //console.log(player.data.list.Eject);
    //console.log(box.children.entries);
    //console.log(playerInGround);
    //console.log(touchesAttack.isDown);
    //console.log(-26 * 6);
    //console.log(player.data.list.Climb);
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
    //console.log(enemyCanDie);
    //console.log(playerCanFall);
    // theGamePad.left = true
    // console.log(theGamePad);
    //console.log(theGamePad.gamepads);
    //console.log(gamePadCombo);
    //console.log(this.input.gamepad.total);
    //console.log(this.input.gamepad.gamepads.length);
    //if(player.flipX === true && player.body.velocity.x === 0){console.log('flip');}
    //console.log(player.body.velocity.y);
    //console.log(touchesAttack._justDown);
    //console.log(rageMode)
    //console.log(enemyCanDie);

    if(counterMovePlayer === 28){
        KnockBack()
    }
    if(counterMovePlayer === 14){
        GuardKnockBack()
    }
    if(player.data.list.health <= 0){                                                              //Player Die 
        themeSong.stop();
        player.anims.play('knockBack', true);
        counterMovePlayer = 999;
        player.data.list.health = 0;

        player.on('animationcomplete', ()=>{                                                        // GAME OVER
            this.anims.pauseAll();
            GameOver = true;
            gameoverSong.play();
            if(Score > personalBest){
                localStorage.setItem('score', Score)
            }
            gameOverText.setDepth(3);
        });
        setTimeout(()=>{
            if(touchesAttack._justDown === true  && GameOver === true                             // Restart Game
            || theGamePad.X && GameOver === true){
                this.registry.destroy(); //destroy registry
                this.events.off(); // disable all active events
                this.scene.start(); // restart current scene
                gameoverSong.stop();
                spawnCounter = 0;
                Score = 0;
                GameOver = false;
                this.anims.resumeAll();
                counterMovePlayer = 0;
                //console.log(theGamePad);
                //console.log(gamePadCombo.includes);
                
            }
        },5000)
    }

    if(player.data.list.special >= 6){
        player.data.list.special = 6;
    }
    if(player.data.list.special <= 0){
        player.data.list.special = 0;
    }
    // CONTROL PLAYER
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if((theGamePad.X)){                                                                             //Gamepad Combo
    //         if(gamePadCombo.includes("BDA") || gamePadCombo.includes("BGA")){
    //                 if(playerInGround === true){
    //                     if(player.data.list.special >= 1){
    //                         counterMovePlayer = 32;
    //                         tornadoSlash();
    //                         console.log(gamePadCombo[0]);
    //                         gamePadCombo = [];
    //                     }
    //                 }
    //                 if(playerInGround === false){
    //                     attackintheair = true
    //                     counterMovePlayer = 34;
    //                     attackintheair = true;
    //                     powerAttackJump();
    //                 }
    //                 gamePadCombo = [];
    //         }
    //         else if(gamePadCombo.includes("BGDA") || gamePadCombo.includes("BDGA")){
    //                 if(playerInGround === true){
    //                     if(player.data.list.special >= 3){
    //                         counterMovePlayer = 33;
    //                         UltraSlash();
    //                         gamePadCombo = [];
    //                     }
    //                 }
    //                 gamePadCombo = [];
    //         }
    //         else{
    //             gamePadCombo = [];
    //         }
    // }
        if(theGamePad.up && counterMovePlayer === 0){                                                               //up (climb pad)
            console.log('haut');
            if(playerInGround === false){
                player.data.list.Climb = true
            }
        }
        //console.log(theGamePad.X);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        if (leftkey.isDown && counterMovePlayer === 0 || theGamePad.left  && counterMovePlayer === 0){              //left
                heroLeft();
            }
        else if (rightkey.isDown && counterMovePlayer === 0 || theGamePad.right && counterMovePlayer === 0){       //right
                heroRight();
            }
        else if (player.setVelocityX(0)){                                                               //idle
                if(playerInGround === true && counterMovePlayer === 0){
                    player.anims.play('idle', true);
                    player.setGravityY(0);
                    player.body.checkCollision.right = true;
                    player.body.checkCollision.left = true;
                    playerCanFall = true;
                    setCombo()     
                }
            }

        
        if(Phaser.Input.Keyboard.JustDown(upkey) && counterMovePlayer === 0 
        || gamepadJump === true && counterMovePlayer === 0){                                                //jump        
                                                    
           jumpAction();
        }     

        if(player.body.velocity.y > 0 &&                                                                    //fall
            attackintheair === false &&                                    
            counterMovePlayer != 28 && 
            counterMovePlayer != 14 && 
            playerCanFall === true &&
            attackinground === false){   

            fallAction()
            playerInGround = false
            gamepadJump = false
        }
        
        if (touchesGuard.isDown && playerInGround === true && counterMovePlayer === 0 ||
            theGamePad.Y && playerInGround === true && counterMovePlayer === 0 ){                             //guard
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('guard', true);
            player.data.list.Guard = true;
            setCombo()
        }else if(touchesGuard.isUp && playerInGround === true && counterMovePlayer != 14){
             player.data.list.Guard = false}
        
        if(Phaser.Input.Keyboard.JustDown(touchesAttack) || gamepadAttack === true){                            //attack     
            gamepadAttack = false;
            counterMovePlayer++;
            cameraPlayer.shakeEffect.progress = 0                                                   //shaker camera reset
            cameraPlayer.shakeEffect._elapsed = 0
            if (countTest === 2 && playerInGround === true){attackComboThree();}
            if(counterMovePlayer === 1 && playerInGround === true){attackComboOne();}
            else if (counterMovePlayer >= 2 && playerInGround === true){attackComboTwo();}
            else if(counterMovePlayer === 1 && playerInGround === false){attackJump();}
        }  

        if(Phaser.Input.Keyboard.JustDown(enterKey) && startGame === true ||
        theGamePad.X && startGame === true){     
            player.x = 600;
            player.y = 1150;
            startGame = false;
            rageCloud.anims.play('rage',true);
            //player.anims.play('idle', true)
            soundVolume = 1;
            swordAir.volume = 0.4;
            themeSong.play();
            
            // this.anims.resumeAll();
        }
// }  
}


















//FUNCTIONS

function attackComboOne(){                                                                                      // attack one
        attackinground = true;
        var nameAttack = 'attackOne'
        player.anims.play(nameAttack, true);
        swordAir.play();
        //player.data.list.special = player.data.list.special + 1;
        rageValue = 1

            player.on('animationupdate', ()=>{
                if(nameAttack === player.anims.currentAnim.key){
                    if(4 === player.anims.currentFrame.index){
                            player.data.list.Eject = 0;
                            if(playerFlip === true){colideATK.setX(player.x -50);colideATK.setY(player.y);}
                            if(playerFlip === false){colideATK.setX(player.x +50);colideATK.setY(player.y)}    
                            if(playerFlip === true){player.setVelocityX(-100)}
                            if(playerFlip === false){player.setVelocityX(100)}
                    };
                    if(player.anims.currentFrame.index >= 5){
                        colideATK.setX(0)
                        //colAtk2.destroy()
                    }
                    if(player.anims.currentFrame.index >= 6){
                        countTest = 1
                    };
                    if(13 === player.anims.currentFrame.index){
                        canShoryu = true
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
    swordAir.play();
    //player.data.list.special = player.data.list.special + 1;
    rageValue = 1


    player.on('animationupdate', ()=>{
        if(nameAttack2 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 3){
                if(playerFlip === true){player.setVelocityX(-200)}
                if(playerFlip === false){player.setVelocityX(200)}
            }
            if(player.anims.currentFrame.index === 4){
                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -50);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +50);colideATK.setY(player.y)}
            }
            if(player.anims.currentFrame.index >= 5){
                colideATK.setX(0)
                // player.data.list.Eject = 0;
            }
            if(player.anims.currentFrame.index >= 6 && player.anims.currentFrame.index <= 10){
                countTest = 2;
            }
            if(12 === player.anims.currentFrame.index){//reset counterMove : 0
                //player.data.list.Eject = 0;
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
    var nameAttack = 'attackThree'
    // var colAtk2 = colideATK2.get();
    // colAtk2.visible = false;
    swordAir.play();
    //player.data.list.special = player.data.list.special + 1;
    rageValue = 1;
    player.data.list.Eject = 3;


    player.on('animationupdate', ()=>{
        if(nameAttack === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 5){
                if(playerFlip === true){colideATK.setX(player.x -80);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +80);colideATK.setY(player.y)}
            }
            if(player.anims.currentFrame.index <= 6){
                if(playerFlip === true){player.setVelocityX(-200)}
                if(playerFlip === false){player.setVelocityX(200)}
                player.data.list.Eject = 3;
                countTest = 0;
            }
            
            if(player.anims.currentFrame.index >= 7){
                
                colideATK.setX(0)
                // colAtk2.setY(player.y - 9999)//position en dehors de l'éccran
            }
            if(12 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMovePlayer = 0;
                //player.data.list.Eject = 0;
                attackinground = false;
            }
        }
    });
}

function heroLeft(){                                                                                        //left
    player.setVelocityX(-playerVelocityX);
    playerFlip = player.flipX=true;

    if(playerInGround === true){
        player.anims.play('runLeft', true);
    }
}
function heroRight(){
    player.setVelocityX(playerVelocityX);
        playerFlip = player.flipX=false;
            
    if(playerInGround === true){
        player.anims.play('runRight', true);
    }
}

function jumpAction(){                                                                                      // Jump
    if(playerInGround === true){ 
        player.anims.play('jump', true);
        gamepadJump = false
        player.setVelocityY(-450);
        playerInGround = false;
       
    }
    else{
        player.data.list.Climb = true
    }
}

function fallAction(){                                                                                      // Fall
        player.anims.play('fall', true) 
        player.data.list.Climb = false;

}

function attackJump(){                                                                                      //attack jump
    player.anims.play('jumpAtk', true);
    var nameAttack4 = 'jumpAtk';
    swordAir.play();
    gamepadJump = false
    attackintheair = true;
    //player.data.list.special = player.data.list.special + 1;
    rageValue = 1;
    var velocityX = player.body.velocity.x
    player.data.list.Eject = 3;



    player.on('animationupdate', ()=>{
        if(nameAttack4 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colideATK.setX(player.x -65);colideATK.setY(player.y +20)}
                if(playerFlip === false){colideATK.setX(player.x +65);colideATK.setY(player.y +20)} 
            }
            if(player.anims.currentFrame.index >= 5){
                colideATK.setX(0)
            }
            if(player.anims.currentFrame.index < 25){
                player.body.velocity.x = velocityX;
            }
            if(playerInGround === true || player.anims.currentFrame.index >= 25){
                counterMovePlayer = 0; 
                player.data.list.Eject = 0;

                //colideATK.body.enable = true;
                // colAtk5.destroy();
            ;}
        }
    });
}
function powerAttackJump(){                                                                                 //PowerAttackJump
    //if(player.anims.currentAnim.key === 'fall'){
        //player.anims.stop()
        spevalue = player.data.list.special = player.data.list.special - 2;
        player.anims.play('specialAirSlash', true);
        swordAir.play();
        if(rageMode === false){
            rageValue = 0;
        }else{
            rageValue = 1;
        }
        
        player.on('animationupdate', ()=>{
            if('specialAirSlash' === player.anims.currentAnim.key){
                if(player.anims.currentFrame.index == 1){
                    swordAir.play();
                    player.data.list.Eject = 3;
                    colideATK.setX(player.x);colideATK.setY(player.y)
                }
                if(player.anims.currentFrame.index == 2){
                    colideATK.setX(player.x +40);colideATK.setY(player.y)
                }
                if(player.anims.currentFrame.index == 3){
                    player.data.list.Eject = 1;
                    colideATK.setX(player.x +40);colideATK.setY(player.y)
                }
                if(player.anims.currentFrame.index == 4){
                    colideATK.setX(player.x -40);colideATK.setY(player.y)
                }
                if(player.anims.currentFrame.index <= 4){
                    canShoryu = false
                }
                if(player.anims.currentFrame.index == 5){
                    // camera.main.shake(200,0.0004);

                    player.data.list.Eject = 3;
                    colideATK.setX(player.x +40);colideATK.setY(player.y)
                    cameraPlayer.shakeEffect.intensity.x = 0.001
                    cameraPlayer.shakeEffect.intensity.y = 0.001
                    cameraPlayer.shakeEffect.duration = 200
                    cameraPlayer.shakeEffect.isRunning = true
                    
                    console.log(cameraPlayer.shakeEffect);
                }
                if(player.anims.currentFrame.index == 6){
                    colideATK.setX(player.x -40);colideATK.setY(player.y +40)
                    colideATK.setX(player.x +60);colideATK.setY(player.y +40)
                    canShoryu = true
                }
                if(player.anims.currentFrame.index == 7){
                    player.data.list.Eject = 1;
                }
                if(player.anims.currentFrame.index == 8){
                    colideATK.setX(player.x +60);colideATK.setY(player.y +40)
                }
                if(player.anims.currentFrame.index == 9){
                    colideATK.setX(player.x -60);colideATK.setY(player.y +40)
                }
                if(player.anims.currentFrame.index < 13){
                    player.setVelocityY(1200)
                }
                if(player.anims.currentFrame.index >= 16){
                    counterMovePlayer = 0; 
                    attackinground = false;
                    player.data.list.Eject = 0;
                    colideATK.setX(-99)
                    //colideATK.body.enable = true;
                    // colAtk5.destroy();
                ;}
            }
        });

    //}
}
function shieldTackle(){                                                                                     // ShieldTackle
    player.anims.play('shieldAttack', true);
    player.data.list.Eject = 0;
    canShoryu = true;

    spevalue = player.data.list.special = player.data.list.special - 2;
    if(rageMode === false){
        rageValue = 0;
    }else{
        rageValue = 1;
    }
    
    player.on('animationupdate', ()=>{
        if('shieldAttack' === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 13 ){
                if(playerFlip === true){player.setVelocityX(-playerVelocityX * 2)}
                if(playerFlip === false){player.setVelocityX(playerVelocityX * 2)}
                playerCanFall = false;
                player.setGravityY(-10);
            }
            if(player.anims.currentFrame.index === 9){
                if(playerFlip === true){colideATK.setX(player.x -40);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +40);colideATK.setY(player.y)}
                player.data.list.Eject = 2;

            }
            if(player.anims.currentFrame.index === 10){
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y)}
                player.data.list.Eject = 0;

            }
            if(player.anims.currentFrame.index === 11){
                if(playerFlip === true){colideATK.setX(player.x -70);colideATK.setY(player.y)}
                if(playerFlip === false){colideATK.setX(player.x +70);colideATK.setY(player.y)}
                player.data.list.Eject = 3;

            }
            if(player.anims.currentFrame.index >= 14){
                colideATK.setX(0)
                player.data.list.Eject = 0;

            }
            if(player.anims.currentFrame.index >= 18 ){
                player.data.list.special = spevalue;
                colideATK.setX(0);colideATK.setY(0);
                playerCanFall = false;
                attackinground = false;
                player.setGravityY(0);
                //player.data.list.Eject = 0;
                counterMovePlayer = 0;
            }
        }
    });


}
function tornadoSlash(){                                                                                      // tornado slash
    //if(player.anims.currentAnim.key != 'shoryuSlash'){
    playerCanFall = false;
    player.anims.play('shoryuSlash', true);
    var nameAttack = 'shoryuSlash';
    swordAir.play();
    spevalue = player.data.list.special = player.data.list.special - 1;
    if(rageMode === false){
        rageValue = 0;
    }else{
        rageValue = 1;
    }
    player.on('animationupdate', ()=>{
        
        if(nameAttack === player.anims.currentAnim.key){
            
            if(player.anims.currentFrame.index <= 3 ){
                canShoryu = false
                player.setGravityY(-1200);
                if(playerFlip === true){player.setVelocityX(-playerVelocityX * 4)}
                if(playerFlip === false){player.setVelocityX(playerVelocityX * 4)} 
                // console.log(player.body.checkCollision.left = false);
                // console.log(player.body.checkCollision.right = false);
            }

            if(player.anims.currentFrame.index === 2 ){
                //player.anims.stop()
                if(playerFlip === true){colideATK.setX(player.x -50);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +50);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index >= 3 ){
                player.data.list.Eject = 0;
                colideATK.setX(0);
                //colideATK.body.enable = true;
                
            }
            if(player.anims.currentFrame.index === 4 ){
                player.setGravityY(0);
                player.data.list.Eject = 1;
                //player.anims.stop()
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y -32)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y -32)} 
            }
            
            if(player.anims.currentFrame.index === 5 ){
                //colideATK.body.enable = true;
                colideATK.setX(0)
                colideATK.setY(0)
                swordAir.play();
                
            }
            if(player.anims.currentFrame.index === 6 ){
                
                //player.anims.stop()
                colideATK.setY(player.y -120)
                player.data.list.Eject = 1;
                if(playerFlip === true){colideATK.setX(player.x -30);}
                if(playerFlip === false){colideATK.setX(player.x +30);} 
                playerInGround = false
            }
            
            if(player.anims.currentFrame.index === 7 ){
                colideATK.setX(0);
                colideATK.setY(0);
            }

            if(player.anims.currentFrame.index >= 4 &&
                player.anims.currentFrame.index <= 6){
                player.setVelocityY(-320)
                
            }
            
            if(player.anims.currentFrame.index >= 16){
                canShoryu = true;
                player.data.list.special = spevalue;
                player.data.list.Eject = 0;
                attackinground = false;
                if(player.body.velocity.y != 0){
                    playerCanFall = false
                    
                }else{
                    playerCanFall = true;
                    counterMovePlayer = 0;
                }
                
            }
        }
    }); 
    //}   
}

function UltraSlash(){
   // console.log('ultra');
    player.anims.play('ultra', true);
    var nameAttack = 'ultra';
    swordAir.play();
    canShoryu = true;
    
    spevalue = player.data.list.special = player.data.list.special - 3;
    rageValue = 0;

    player.on('animationupdate', ()=>{
        if(player.data.list.health <= 0){
            counterMovePlayer = 999;
        }
        if(nameAttack === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index >= 2 && player.anims.currentFrame.index <= 3 ){
                //player.data.list.special = spevalue;
                player.data.list.Eject = 2;
                swordAir.play();
                player.setGravityY(600);
                

                if(playerFlip === true){
                    player.setVelocityX(-playerVelocityX * 3)
                    colideATK.setX(player.x -50);colideATK.setY(player.y +10)
                }
                if(playerFlip === false){
                    player.setVelocityX(playerVelocityX * 3)
                    colideATK.setX(player.x +50);colideATK.setY(player.y +10)
                }
            }
            // if(player.anims.currentFrame.index < 61 ){
            //     player.setGravityY(-1000);
            //     // if(playerFlip === true){player.setVelocityX(-playerVelocityX + 10)}
            //     // if(playerFlip === false){player.setVelocityX(playerVelocityX + 10)} 
            // }
            if(player.anims.currentFrame.index === 4 ){
            swordAir.play();

                //player.anims.stop()
                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 6){
            swordAir.play();
            
                player.data.list.Eject = 2;
                //player.anims.stop()
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 10){
            swordAir.play();

                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 14){
            swordAir.play();

                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 17){
            swordAir.play();

                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y +10)} 
            }
            // if(player.anims.currentFrame.index === 18){
            //     player.data.list.Eject = 2;
            //     if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y +10)}
            //     if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y +10)} 
            // }
            if(player.anims.currentFrame.index === 21){
            swordAir.play();

                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -75);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +75);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 24){
            swordAir.play();

                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -70);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +70);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 26){
            swordAir.play();

                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -80);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +80);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 30){
            swordAir.play();

                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -70);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +70);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 36){
            swordAir.play();

                player.data.list.Eject = 0;
                if(playerFlip === true){colideATK.setX(player.x -65);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +65);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 42){
            swordAir.play();

                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -80);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +80);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 50){
            swordAir.play();

                player.data.list.Eject = 1;
                if(playerFlip === true){colideATK.setX(player.x -70);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +70);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 54){
                swordAir.play();
                player.data.list.Eject = 2;
                if(playerFlip === true){colideATK.setX(player.x -60);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +60);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index === 58){
            swordAir.play();

                player.data.list.Eject = 1;
                player.setVelocityX(0);
                if(playerFlip === true){colideATK.setX(player.x -85);colideATK.setY(player.y +10)}
                if(playerFlip === false){colideATK.setX(player.x +85);colideATK.setY(player.y +10)} 
            }
            if(player.anims.currentFrame.index >= 64){

                player.data.list.special = spevalue;
                colideATK.setX(0);colideATK.setY(0);
                playerCanFall = false;
                attackinground = false;
                player.setGravityY(0);
                //player.data.list.Eject = 0;
                counterMovePlayer = 0;
            }
        }
    })
}

function KnockBack(){                                                                                  // Knock Back
    canShoryu = true
    player.setGravityY(0);
    player.data.list.Eject = 0;
    setCombo()
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
                        playerCanFall = false;
                    }else{
                        playerCanFall = true;
                        countTest = 0;
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
                player.setGravityY(2000)
            }
            if(player.anims.currentFrame.index >=18){
                
                player.setGravityX(0)
            }
        }
    });
}

function GuardKnockBack(){  
    player.data.list.Guard = true                                                                            // Guard
    player.data.list.Eject = 0;
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
    setTimeout(()=>{
        piece.setBounce(0.95);
        piece.setVelocityX(0);
    },1600)
}

function createSlash(){
    var slash = hittableObject.create(0,0,'slash',0,true);
    slash.anims.play('slashed', true)
    slash.rotation = Phaser.Math.Between(0,2);
    //slash.setScale(5);
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
    // console.log(enemySpawner.y);
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
    enemyone.setData('stopMove', false);
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
    if(typeOfEnemy === 'RunMan'){
        enemyone.setData('randomValue',200);
    }
    if(typeOfEnemy === 'CrossBow'){                                                                     //create Arrow
        var arrow = Arrow.create(-1000, 0,'carreau',0,true);
        arrow.setSize(20, 4);
        arrow.setScale(2)
        arrow.setData('id', id);
    }
    if(typeOfEnemy === 'PoleAxe'){
        enemyone.setData('health', 20);
        enemyone.setData('randomValue',Phaser.Math.Between(10,50));
    }
    if(typeOfEnemy === 'box'){                                                                          //create box
        enemyone.setSize(35, 35);
        enemyone.body.checkCollision.up = false;
        enemyone.body.checkCollision.left = false;
        enemyone.body.checkCollision.right = false;
        enemyone.setData('health', 3);
    }       
}

function enemyStand(enmy1){                                                                             // enemy stance
    enmy1.setVelocityX(0);
    enmy1.data.list.EnemyIsAttack = true

    // enmy1.body.checkCollision.left = true;
    // enmy1.body.checkCollision.right = true;
}

function enemyWalkFront(enemy1,target,game){                                                            // enemy Walk
enemy1.setBounce(0, 0)
    if(enemy1.data.list.type != 'box'){
        var animsName = 'walk'+enemy1.data.list.type;

        enemy1.anims.play(animsName, true)

        if(GameOver === false){
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
        }else{
            game.physics.moveToObject(enemy1, target, 0);
        }
    }else{}    
}

function enemyWalkBack(enemy1,target,game){                                                             // enemy walkBack
    //enemy1.body.setSize(25,56) 


    enemy1.setBounce(0, 0)
    var animsName = 'walk'+enemy1.data.list.type;
    enemy1.anims.play(animsName, true)
    
    game.physics.moveToObject(enemy1, target, - (enemy1.data.list.randomValue));
    enemy1.data.list.AttackIsFinish = false
    enemy1.setVelocityY(400);
    
    enemy1.on('animationupdate', ()=>{
        if('walkRunMan' === enemy1.anims.currentAnim.key){
            //game.physics.moveToObject(enemy1, target,0);
            if(enemy1.anims.currentFrame.index < 10){
                enemy1.data.list.CounterMove = 2
            }
        }
        if(animsName === enemy1.anims.currentAnim.key){
            if(enemy1.anims.currentFrame.index >= 4){
                enemy1.data.list.CounterMove = 0 // ou 2 ?
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
    // if(enemyone.data.list.health <= 0){
    //     enemyone.data.list.CounterMove = 4;
    // }else{
    // }
    enemyCanDie = true
    var animsName = 'attack'+enemyone.data.list.type;
    //console.log(animsName);
//console.log('enemyHealth :'+ enemyone.data.list.health);
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
        if('attackSpearMan' === enemyone.anims.currentAnim.key){
            // if(enemyone.anims.currentFrame.index >= 4 &&
            //     enemyone.anims.currentFrame.index <= 6){
            //         if(enemyone.flipX === true){enemyone.setVelocityX(200)}
            //         if(enemyone.flipX === false){enemyone.setVelocityX(-200)}
            // }
            if(enemyone.anims.currentFrame.index === 5){
                enemyone.data.list.AtkCollide = true
                
                enemyone.setSize(165,56)
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

            if(enemyone.anims.currentFrame.index > 5 && enemyone.anims.currentFrame.index <= 12){
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
        if('attackRunMan' === enemyone.anims.currentAnim.key){                                              //attack RunMan
            if(enemyone.anims.currentFrame.index === 3 ){
                enemyone.data.list.AtkCollide = true
                enemyone.setSize(90,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },150)
            }
            if(enemyone.anims.currentFrame.index < 5 ){
                if(enemyone.flipX === true){enemyone.setVelocityX(600)}
                if(enemyone.flipX === false){enemyone.setVelocityX(-600)}
            }
            if(enemyone.anims.currentFrame.index === 8 ){
                enemyone.data.list.AtkCollide = true
                enemyone.setSize(90,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },150)
            }
            if(enemyone.anims.currentFrame.index >= 12){ 
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
        if('attackAssassin' === enemyone.anims.currentAnim.key){                                              //attack Assassin
            if(enemyone.anims.currentFrame.index < 10)
                {
                    if(enemyone.flipX === true){enemyone.setVelocityX(200)}
                    if(enemyone.flipX === false){enemyone.setVelocityX(-200)}
                }
            if(enemyone.anims.currentFrame.index === 4){
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
        

    });
}
function enemyAttackTwo(enemyone){
    enemyone.setVelocityX(0);
    var animsName = 'attackTwo'+enemyone.data.list.type;

    enemyone.anims.play(animsName,true)
    
    enemyone.on('animationupdate', ()=>{                                                                
        if('attackTwoAssassin' === enemyone.anims.currentAnim.key){
            if(enemyone.anims.currentFrame.index <= 5){
                enemyone.setVelocityY(-400); 
            }
            if(enemyone.anims.currentFrame.index >= 8 ){
                enemyone.setVelocityY(800); 
            }
            if(enemyone.anims.currentFrame.index >= 6 &&
            enemyone.anims.currentFrame.index <= 7 ){
                
                enemyone.setVelocityY(0); 
            }
            if(enemyone.anims.currentFrame.index == 8 ){
                enemyone.data.list.AtkCollide = true

                enemyone.setSize(100,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },50)
            }
            if(enemyone.anims.currentFrame.index <= 10 ){
                    if(enemyone.flipX === true){enemyone.setVelocityX(800)}
                    if(enemyone.flipX === false){enemyone.setVelocityX(-800)}
            }
            if(enemyone.anims.currentFrame.index >= 11 ){ 
                enemyone.data.list.CounterMove = 0 
                enemyone.data.list.AttackIsFinish = true
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
        currentArrow.setY(enemy.y - 24)  

        if(enemy.flipX === true)
        {
            currentArrow.flipX = true;
            currentArrow.setX(enemy.x + 35)
            currentArrow.setVelocityX(200)
        }
        else
        {
            currentArrow.flipX = false;
            currentArrow.setX(enemy.x - 35) 
            currentArrow.setVelocityX(-200)
        }
    }
}

function enemyKnockBack(enmy){
//console.log('hello');
enmy.setVelocityX(0);
if(enmy.data.list.type != 'box'){
    if(player.data.list.Eject === 0){                                                                           // knock back enemy                                             
       
            enmy.data.list.EnemyIsAttack = false;
            var animsName = 'knockback'+enmy.data.list.type
            enmy.anims.play(animsName,true);
            //var enemyAction2 = 'knockbackEnemy1';
            //console.log(animsName);
                enmy.on('animationupdate', ()=>{
                    if(animsName === enmy.anims.currentAnim.key){

                        if(enmy.anims.currentFrame.index <= 3){
                            
                            if(enmy.flipX === true){enmy.setVelocityX(0)}
                            if(enmy.flipX === false){enmy.setVelocityX(0)}   
                        }
                        if(enmy.anims.currentFrame.index >= 5){ 
                                enmy.data.list.CounterMove = 0

                            enmy.data.list.AttackIsFinish = true
                        }
                    }
                });

    }else if(player.data.list.Eject === 1){                                                                    // eject enemy
        enmy.data.list.EnemyIsAttack = false;
        var animsName2 = 'eject'+enmy.data.list.type
        enmy.anims.play(animsName2,true);
        
        enmy.data.list.CounterMove = 77;
        
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
                    // if(enmy.anims.currentFrame.index >= 16){
                    //     enmy.body.checkCollision.left = false;
                    //     enmy.body.checkCollision.right = false;             

                    // }
                    if(enmy.anims.currentFrame.index >= 20 &&
                        enmy.body.velocity.y === 0){ 

                        enmy.data.list.AttackIsFinish = true
                        enmy.setVelocityX(0)
                        // enmy.body.checkCollision.left = true;
                        // enmy.body.checkCollision.right = true;
                        
                            if(enmy.data.list.type === 'CrossBow'){
                                enmy.data.list.CounterMove = 2
                                
                            }else{
                                enmy.data.list.CounterMove = 0
                                enmy.data.list.AttackIsFinish = true
                            }
                    }
                }
            });
    } else if(player.data.list.Eject === 2){
        var animsName2 = 'expulse'+enmy.data.list.type
        enmy.anims.play(animsName2,true);

        enmy.data.list.CounterMove = 77;

        enmy.on('animationupdate', ()=>{
            if(animsName2 === enmy.anims.currentAnim.key){
                if(enmy.anims.currentFrame.index <= 3){
                    if(enmy.flipX === true){enmy.setVelocityX(0)}
                    if(enmy.flipX === false){enmy.setVelocityX(0)}  
                    enmy.setVelocityY(-100)
                }
                if(enmy.anims.currentFrame.index >= 6){
                    // enmy.setVelocityX(0)
                    // enmy.setVelocityY(0)
                    enmy.data.list.CounterMove = 0;
                    enmy.data.list.AttackIsFinish = true
                }
            }
        });
    } else if(player.data.list.Eject === 3){
        // if(enmy.anims.currentAnim.key === 'expulse'+enmy.data.list.type){
            var animsName2 = 'knockback'+enmy.data.list.type;
            enmy.anims.play(animsName2,true);
    
            enmy.data.list.CounterMove = 77;
    
            enmy.on('animationupdate', ()=>{
                if(animsName2 === enmy.anims.currentAnim.key){
                    if(enmy.anims.currentFrame.index <= 3){
                        if(enmy.flipX === true){enmy.setVelocityX(-200)}
                        if(enmy.flipX === false){enmy.setVelocityX(+200)}  
                        enmy.setVelocityY(-100)
                        enmy.data.list.CounterMove = 77;

                    }
                    if(enmy.anims.currentFrame.index >= 6){
                        enmy.setVelocityX(0)
                        enmy.setVelocityY(0)
                        enmy.data.list.CounterMove = 0;
                        enmy.data.list.AttackIsFinish = true
                    }
                }
            });
        // }d
    }
}else{                                                                                              //knock box
    knockBox(enmy);
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
                    //createCoin(enmyOne)
                    enmyOne.body.destroy();
                    }
                // if(enmyOne.anims.currentFrame.index === 14){
                //     setTimeout(()=>{createCoin(enmyOne)},0);
                //  }
                if(enmyOne.anims.currentFrame.index >= 14){ 
                    enmyOne.data.list.EnemyIsDie = true;
                    
                    // enmyOne.body.destroy(); 
                }
            }
        }else{console.log(hittableObject.children.entries);}   
    });
}

function collisionAtkEnemies(htblObjct,atk){

    swordImpact.play();
    atk.setX(-800);
    atk.setY(0);
    slashAtk.setY(player.y)
    comboValue ++;

    //if(rageMode === true){
        player.data.list.special = player.data.list.special + rageValue;
    //}
    // console.log(htblObjct.flipX);
    if(player.flipX === true){slashAtk.setX(player.x -100)}
    if(player.flipX === false){slashAtk.setX(player.x +100)}

    slashAtk.anims.play('slashed', true)
    slashAtk.rotation = Phaser.Math.Between(0,2);

    htblObjct.data.list.health = htblObjct.data.list.health - 1;

    if(htblObjct.data.list.type != 'box'){
        enemyCanDie = false
        setTimeout(()=>{
            enemyCanDie = true
        },3000)   
    }
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

function knockBox(enmy){
    if(enmy.data.list.health === 2){
        enmy.anims.play({key : 'damageOne', startFrame : 0},true);
    }
    if(enmy.data.list.health === 1){
        enmy.anims.play({key : 'damageTwo', startFrame : 0},true);
    }
    enmy.on('animationupdate', ()=>{
        
        if(enmy.anims.currentFrame.index === 8){
            enmy.data.list.CounterMove = 0
            enmy.data.list.AttackIsFinish = true
            //enmy.anims.stop();
        }
        if(enmy.anims.currentFrame.index === 5){
            enmy.data.list.CounterMove = 0
            enmy.data.list.AttackIsFinish = true
            //enmy.anims.stop();
        }
    });

}

function setCombo(){
if(comboValue >= 3 && comboValue <= 4){
    Score = Score + 5
    //comboValue = 0;
}
if(comboValue >= 5 && comboValue <= 9){
    Score = Score + 10
    //comboValue = 0;
}
if(comboValue >= 10 && comboValue <= 19){
    Score = Score + 25
    //comboValue = 0;
}
if(comboValue >= 20 && comboValue <= 29){
    Score = Score + 50
    //comboValue = 0;
}
if(comboValue >= 30 && comboValue <= 39){
    Score = Score + 100
    //comboValue = 0;
}
if(comboValue >= 40 && comboValue <= 49){
    Score = Score + 150
    //comboValue = 0;
}
if(comboValue >= 50 && comboValue <= 99){
    Score = Score + 250
    //comboValue = 0;
}
if(comboValue >= 100){
    Score = Score + 500
    //comboValue = 0;
}
return comboValue = 0
}
// function stopEnemies(enemy){
//     enemy.data.list.stopMove = true
//     // enemy.data.list.CounterMove = 74;
//     console.log('kikoou' + enemy.data.list.CounterMove);
//     console.log(enemy.data.list);
// }




