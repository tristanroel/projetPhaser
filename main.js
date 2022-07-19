var configuration = {
    type: Phaser.AUTO,
    pixelArt : true,
    width : 800,
    height : 600,
    backgroundColor : '#353535',
    fps: {
        target: 60,
        forceSetTimeOut: true
      },
    input : {
        gamepad : true
    },
    scale:{
        mode : Phaser.Scale.FIT,
        autoCenter: 1,
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
                    gravity : {y : 1000},
                }
    }
}

var game = new Phaser.Game(configuration);

//var touchesClavier; //touches de direction
var leftkey;
var rightkey;
var upkey;
var touchesAttack; // touche d'attaque

var theGamePad;
var gamepadJump; // : boolean
var gamepadAttack; // : boolean

var player;
var playerVelocityX;
var playerInGround; // : boolean
var counterMove; // compteur combo attack : number
var playerFlip; // direction du joueur : boulean
var PlayerTouchEnemy; // : boolean
var colideATK1; // collision attaque 1 : sprite
var colideATK2; // collision attaque 1 : sprite
var attackintheair; // verifie si peut attaquer en l'air : boolean

var enemySpawn; //spawn enemy
var enemyNumber;

var box; // caisse en bois : sprite

var skyBg; //ciel
var Coin; //pieces
var text; // info command list
var Score = 0; // Score
var scoreText;


var countTest = 0;


function preload(){
    this.load.image('sky','assets/Thesky.png');
    this.load.image('ground','assets/solPave.png');
    this.load.image('ATK1','assets/TRlogo.png');
    this.load.image('spawner','assets/ROELprod.png');
    // this.load.spritesheet('skyAnim', 'assets/Bakcloudanim.png', {frameWidth : 404, frameHeight : 274});
    this.load.spritesheet('slash','assets/Slash.png', {frameWidth : 65, frameHeight : 65});
    this.load.spritesheet('piecette','assets/Coin.png', {frameWidth : 8, frameHeight : 8});
    this.load.spritesheet('hero', 'assets/Sprites/stancearmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroAttack', 'assets/Sprites/sword_attack_move.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herorun', 'assets/Sprites/walkarmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojump', 'assets/Sprites/jumparmed.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('herojumpAtk', 'assets/Sprites/jump_sword_attack.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroGuard', 'assets/Sprites/guard.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('powerSlash', 'assets/PowerSlash.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('box', 'assets/box.png',{frameWidth: 62, frameHeight: 62});
    this.load.spritesheet('theEnemy', 'assets/Enemy/enemiaxe1.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyfall', 'assets/Enemy/enemi1falling.png',{frameWidth: 170, frameHeight: 170});

}

///////////////////////////////////////////////////////////////////////////////////// CREATE
function create(){

    
   //OBJECT

    skyBg = this.add.tileSprite(0, 200, 800, 500, 'sky').setScale(3); //image ciel
    var sol1 = this.add.sprite(200, 570, 'ground').setScale(3);//image sol
    var sol2 = this.add.sprite(1422, 500, 'ground').setScale(3);//image sol
    enemySpawn = this.add.image(1800, -400, 'spawner'); //spawn enemy
    

    Coin = this.physics.add.group({ // piecettes
        //key :'piecette',
        setXY:{x: -800, y :60},
        visible : false,
    });

    hittableObject = this.physics.add.group()
    enemyMoveDetection = this.physics.add.group({allowGravity : false})

    box = this.physics.add.group({ //caisse en bois
        key : 'box',
        name : 'woodBox',
        //allowGravity : false,
        repeat : 2,
        setXY:{x: -100, y :90, stepX: 1000},
        setScale : {x : 3},
    });
    box.children.iterateLocal('setData', 'pv', 4)
    box.children.iterateLocal('setSize', 35,35)
    box.setVelocityY(600)
    
    // var enemy = this.physics.add.group({   //enemy
    //     key :'theEnemy',
    //     setXY:{x: -200, y :366},
    //     setScale : {x : 3}
    // });
    // enemy.children.iterateLocal('setData', 'pv', 5)
    // enemy.children.iterateLocal('setSize', 26,56)


    player = this.physics.add.sprite(200, 310,'hero').setScale(3); // player
    player.body.setSize(25, 58) // hitbox player
    

    colideATK2 = this.physics.add.group({ // collision attaque
        key : 'ATK1',
        allowGravity : false,
        disableBody : true,
        visible : false,
        // size : {x : 200, y : 200}
        //setXY : {x : -999, y : -999}
    })

    // TEXT
    text = this.add.text(-150,510, ' << CONTROL >> \n ← = press "Q"\n → = press "D"\n ↑  = press "Z"\n\n 🗡 = press "J"\n 🛡 = press "I"' , {font : '16px Courier'}); 
    scoreText = this.add.text(10,10, 'SCORE : 0',{ font : '16px Arial Black', color : '#353535'})
    //console.log(colideATK2);
    //////////////////////
    
    //CAMERA
    this.cameras.main.startFollow(player);




    //COLISIONS
    var platform = this.physics.add.staticGroup();// groupe plateforme
        platform.add(sol1)//asigne
        platform.add(sol2)//asigne

        this.physics.add.collider(platform,player, function( pl4yer,theplatform){ //collision entre la plateforrme et le joueur 
            if(theplatform.body.touching.up && pl4yer.body.touching.down){
                attackintheair = false;
                playerInGround = true;
            }
        })
        this.physics.add.collider(platform,box) //collision plateforme et boites
        this.physics.add.collider(box,box, function(box2, box1){ // collisions entre boites
            box1.body.blocked.left = true
            box1.body.blocked.right = true
            box2.body.blocked.left = true
            box2.body.blocked.right = true
            //console.log(box1.body.blocked.left);
        })
        this.physics.add.overlap(Coin, player, function(theplayer, piepiece){ // collision pieces et joueur 
            Score++;
            piepiece.destroy();
            //console.log('Score : '+Score);
            })
        //this.physics.add.collider(platform,enemy) //collision enemy platform

        this.physics.add.collider(box, player, function (theplayer, thebox){ //collision entre box et le joueur 
            // theplayer.setVelocityX(0);
            thebox.setVelocityX(0)
            
            
            if(thebox.body.touching.right || thebox.body.touching.left){
                theplayer.anims.play('runRight', true)
                counterMove = 0;
                playerInGround = true
                //console.log(theplayer.body.angle);
            }
            if(thebox.body.touching.up){
                playerInGround = true;
                thebox.setGravityY(-1)
            }
            else{playerInGround = false;}
        });

        this.physics.add.collider(Coin, platform)

        // this.physics.add.overlap(colideATK2, enemy, function(colAtk2, theEnemy){ // collision attaque sur l'enemy
        //     colAtk2.destroy();
        //     theEnemy.data.list.pv = theEnemy.data.list.pv - 1;
        //     theEnemy.anims.play('knockbackenemy1', true);

        //     player.anims.pause();
        //     setTimeout(()=>{player.anims.resume()},200)
        //     //console.log('ouille !!!');
        //     if(theEnemy.data.list.pv <= 0){
        //         // theEnemy.anims.play('fallenemy1', true);
        //         dieEnemyOne(theEnemy);
        //         enemyPlayerContact.active = false;
        //         setTimeout(()=>{theEnemy.destroy()},2000)            }
        // });

        this.physics.add.overlap(colideATK2, box, function(colAtk2, boite){ // collision entre attaque et boites 
            boite.data.list.pv = boite.data.list.pv - 1;
            // colAtk2.disableBody(false);
            colAtk2.destroy()
            
            player.anims.pause();
            setTimeout(()=>{player.anims.resume()},200)

            createCoin(boite, Coin)

            if(boite.data.list.pv === 3){boite.anims.play('damageOne', true);}
            else if(boite.data.list.pv === 2){boite.anims.play('damageTwo', true);}
            else if(boite.data.list.pv <= 1){
                boite.anims.play('damageLast', true);
                boite.on('animationcomplete',()=>{
                    for(var i = 0;i < 20;i++){ createCoin(boite)};
                    boite.destroy();})
            }
        })

        this.physics.add.collider(hittableObject, platform, function(htblobjct, pltfrm){})   //collision Enemy + platform
        
    attackintheair = false;
    counterMove = 0;
    playerVelocityX = 350;
    playerInGround = false;
    PlayerTouchEnemy = false;
    
    
    //Touches joueurs / ENTREE CLAVIER
    leftkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    rightkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    upkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    //touchesClavier = this.input.keyboard.addKeys('Q, Z, S, D'); //direction
    touchesAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); //attack
    touchesGuard = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Guard

    var specialAtkOne = this.input.keyboard.createCombo([40, 39, 32], {resetOnMatch:true, maxKeyDelay:700}); //300ms pour taper le combo, sinon se reinitialise

    this.input.keyboard.on('keycombomatch', function(combo){ //verification du secialAtk entré
        if(combo === specialAtkOne && player.body.touching.down && counterMove === 0){
            console.log('connaldemelde');
            counterMove = 32;
            atkSpeOne();
        }
    }) 
  
    gamepadAttack = false;
    gamepadJump = false;
    theGamePad = this.input.gamepad.on('down', function(pad, button, index){
        theGamePad = pad
    }, this);
    

    //ANIMATIONS

    //animation player
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('hero',{frames: [0, 1, 2, 3]}),
        frameRate: 4,
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
        frameRate: 25,
        //repeat: -1
    })

    this.anims.create({
        key: 'attackTwo',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]}),
        frameRate: 22,
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
        key: 'PowerSlash',
        frames: this.anims.generateFrameNumbers('powerSlash',{frames: [0 ,1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}),
        frameRate: 16,
        //repeat: -1
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
        key: 'stancenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [0]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'walkenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'attackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 5, 5, 6, 7, 7, 7, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0]}),
        frameRate: 5,
    });
    this.anims.create({
        key: 'knockbackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [8 ,9 ,9, 0]}),
        frameRate: 9,
        
    });
    this.anims.create({
        key: 'fallenemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [0, 1, 2, 3, 3, 3, 3, 3, 3, 3]}),
        frameRate: 8,
    });

    // coin animation
    this.anims.create({
        key: 'turnPiecette',
        frames: this.anims.generateFrameNumbers('piecette',{frames: [1, 1, 2, 3]}),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'slashed',
        frames: this.anims.generateFrameNumbers('slash',{frames: [0, 1, 2, 2]}),
        frameRate: 25,
    });


    // coin.getChildren().forEach(function() {
    //skyBgAnim.anims.play('lescloud', true)
    //coin.anims.play('turnPiecette', true);
    //coin.setOrigin(box.x, box.y)   
    //enemy.anims.play('stancenemy1', true);
    //enemy.playAnimation('attackenemy1');
    
    for(var i = 0;i < 56; i++){
        setTimeout(()=>{createEnemyOne(enemySpawn, i);},5000 + (i * 7000))
    }
    //createEnemyOne(enemySpawn, player, this);
    console.log(enemySpawn);
    //createSlash()
    //setTimeout(()=>{hittableObject.children.entries[1].destroy()},8000)
    //this.physics.moveToObject(enemy, enemy,200)



    // })
    // coin.callAll('animation.add','turnPiecette', 'piecette',[0, 1, 2, 3], true);
    // coin.callAll('animation.play', 'turnPiecette', 'piecette');
    
}

//apparition collision attaque 1
// function collideBox(playerx, playery){ 
//     var ctk = colideATK1.get();
//         if(!ctk) return;
//         if(playerFlip === true){ctk.enableBody(true, playerx -122,playery,true, true)}
//         if(playerFlip === false){ctk.enableBody(true, playerx +122,playery,true, true)}
//         // ctk.enableBody(true, playerx,playery,true, true)
// }

// function destroyCollideBox(player,cAtk){
//     cAtk.disableBody(true,true);
// }


//////////////////////////////////////////////////////////////////////////////////////////////// UPDATE 

function update(time, delta){

    //BACKGROUND AND TEXT
    skyBg.x = player.body.position.x // position du ciel
    skyBg.tilePositionX += 0.5;
    text.x = player.body.position.x - 350; //position text
    text.y = player.body.position.y + 250;
    scoreText.x = player.body.position.x + 250; //position Score
    scoreText.y = player.body.position.y -180;
    scoreText.setText('SCORE : '+ Score) // maj score

    //ENEMY UPDATE
    for(var i = 0; i < hittableObject.children.entries.length; i++){
        if(hittableObject.children.entries[i] != undefined && hittableObject.children.entries[i].data.list.name === 'EnemyOne'){
            
            var currentEnemy = hittableObject.children.entries[i];

            //this.physics.add.collider(hittableObject, platform, function(htblobjct, pltfrm){})   //collision Enemy + platform
            this.physics.add.collider(currentEnemy, player, function(htblobjct, plyr){  // collision Enemy + player
                if(htblobjct.body.touching.up){
                    if(plyr.flipX === false){}
                    if(plyr.flipX === true){}
                }
                if(htblobjct.body.touching.left){}
                //htblobjct.body.enable = false
            });
            this.physics.add.overlap(colideATK2, hittableObject, function(atk, htblObjct){ //collision Attack + enemy
                htblObjct.data.list.CounterMove = 3;
                createSlash()
                PlayerTouchEnemy = true;
                atk.destroy()
                player.anims.pause();
                setTimeout(()=>{player.anims.resume()},200)
                htblObjct.data.list.health = htblObjct.data.list.health - 1;
                //console.log(htblObjct);
            })

            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) > 200){
                currentEnemy.data.list.CounterMove = 1; 
                currentEnemy.data.list.EnemyIsAttack = true; 
            }
            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) < 200 && 
            currentEnemy.data.list.EnemyIsAttack === true){
                currentEnemy.data.list.CounterMove = 2; 
                currentEnemy.data.list.EnemyIsAttack = false
            }
            if(currentEnemy.data.list.health <= 0){currentEnemy.data.list.CounterMove = 4}
            if(currentEnemy.data.list.CounterMove === 0){enemyStand(currentEnemy)}
            if(currentEnemy.data.list.CounterMove === 1){enemyWalkFront(currentEnemy,player,this)};
            if(currentEnemy.data.list.CounterMove === 2){enemyAttack(currentEnemy)}
            if(currentEnemy.data.list.CounterMove === 3){enemyKnockBack(currentEnemy)}
            if(currentEnemy.data.list.CounterMove === 4 && currentEnemy.data.list.EnemyIsDie === false) {enemyDie(currentEnemy)}
            if(currentEnemy.data.list.EnemyIsDie === true){
                    Phaser.Utils.Array.RemoveAt(hittableObject.children.entries, i);
                    currentEnemy.destroy()
            }
        }
        else if(hittableObject.children.entries[i].data.list.name === 'slash'){
            if(player.flipX === true){
                hittableObject.children.entries[i].x = player.x - 150
                hittableObject.children.entries[i].y = player.y
            }else{
                hittableObject.children.entries[i].x = player.x + 150
                hittableObject.children.entries[i].y = player.y
            }
        }  
        else{hittableObject.children.entries[i] = [];} 
    }
    //console.log(Phaser.Math.Distance.BetweenPoints(hittableObject.children.entries[0],player));
    //console.log(enemyMoveDetection.children.entries[0]);
    //enemyMoveDetection.children.entries[0].body.destroy()
    //console.log(theGamePad);
    //console.log(PlayerTouchEnemy);
    //console.log(enemyCounterMove);
    //console.log(counterMove);
    //console.log(player.body.angle);
    //console.log(box.children.entries);
    console.log(playerInGround);
    //console.log(hittableObject.children.entries[0].body.position);
    //console.log(enemyMoveDetection.children.entries[0].body.position);
    //console.log(hittableObject.children.entries[0].anims);
    //console.log(player.anims.currentAnim);
    //console.log(player.anims.currentAnim);
    //console.log(attackintheair);
    //console.log(EnemyIsDie);
    if (leftkey.isDown && counterMove === 0 || theGamePad.left && counterMove === 0){              //left                                          //left
            player.setVelocityX(-playerVelocityX);
            playerFlip = player.flipX=true;

            if(playerInGround === true){
                player.anims.play('runLeft', true);
            }
        }
    else if (rightkey.isDown && counterMove === 0 || theGamePad.right && counterMove === 0){       //right                                            //right
            player.setVelocityX(playerVelocityX);
            playerFlip = player.flipX=false;
           
            if(playerInGround === true){
                player.anims.play('runRight', true);
            }
        }
    else if (player.setVelocityX(0)){                                                               //idle
            if(playerInGround === true && counterMove === 0){
                player.anims.play('idle', true);
            }
        }
    
    if (Phaser.Input.Keyboard.JustDown(upkey) && playerInGround === true && counterMove === 0       //jump
    || theGamePad.A && playerInGround === true && counterMove === 0){ //gamepad
        player.setVelocityY(-500);
        playerInGround = false;
        jumpAction();
    }
    if(player.body.velocity.y > 0 && attackintheair === false){
        player.anims.play('fall', true)
        playerInGround = false
    }     
    

    if (touchesGuard.isDown && playerInGround === true && counterMove === 0){                       //guard
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('guard', true);
       
    }
    
    if(Phaser.Input.Keyboard.JustDown(touchesAttack)){                                              //attack
        counterMove++;
        if(counterMove === 1 && playerInGround === true){attackComboOne();}
        else if (counterMove >= 2 && playerInGround === true){attackComboTwo();}
        else if(counterMove === 1 && playerInGround === false){attackJump();}
        // else{counterMove = 0}
        //if(counterMove === 3){attackComboThree();}  
    }

    // this.physics.world.collide(box, box, function(){
    //     box.setVelocityX(0);
    //     // player.body.touching.down = true;
    //     // box.setVelocityX(0);
    // })
    
  
}

function attackComboOne(){
    //var t = setTimeout()
    
    // if(player.body.touching.down){
        var nameAttack = 'attackOne'
        player.anims.play(nameAttack, true);
        var colAtk2 = colideATK2.get();
        colAtk2.setSize(120,120)
        colAtk2.visible = false;

        //console.log(player.anims.currentAnim.key);// key of attackOne
    
            player.on('animationupdate', ()=>{
               
                // if(playerFlip === false){ colideATK1 = this.add.image(player.x +112, player.y -0, 'ATK1')}
                if(nameAttack === player.anims.currentAnim.key){
                    if(4 === player.anims.currentFrame.index){
                        //APPARITION DU COLLIDER ATTACK
                            //collideBox(player.x,player.y)
                            if(playerFlip === true){colAtk2.setX(player.x -90);colAtk2.setY(player.y);}
                            if(playerFlip === false){colAtk2.setX(player.x +90);colAtk2.setY(player.y)}      
                    };
                    if(player.anims.currentFrame.index >= 2 && player.anims.currentFrame.index <= 3){
                        // if(playerFlip === true){player.setVelocityX(-1000)}
                        // if(playerFlip === false){player.setVelocityX(1000)}
                        //touchesAttack.enabled = false;
                    }
                    if(player.anims.currentFrame.index >= 6){
                        touchesAttack.enabled = true;
                        //gamepad.enabled = true; 
                        colAtk2.destroy()
                    }
                    if(player.anims.currentFrame.index >= 7){countTest = 1};
                    if(13 === player.anims.currentFrame.index){//reset counterMove : 0
                        counterMove = 0;
                    }
                }
            })
   
}
function attackComboTwo(){


if(player.anims.currentAnim.key === 'attackOne'){
    if(countTest === 1){
        player.anims.play('attackTwo', true);
    var nameAttack2 = 'attackTwo'
    var colAtk2 = colideATK2.get();
    colAtk2.setSize(120,120)
    colAtk2.visible = false;

    player.on('animationupdate', ()=>{
        if(nameAttack2 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 3){
                // if(playerFlip === true){player.setVelocityX(-1200)}
                // if(playerFlip === false){player.setVelocityX(1200)}
                //touchesAttack.enabled = false;
            }
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk2.setX(player.x -90);colAtk2.setY(player.y)}
                if(playerFlip === false){colAtk2.setX(player.x +90);colAtk2.setY(player.y)}
            }
            if(player.anims.currentFrame.index >= 5){
                //touchesAttack.enabled = false;
                colAtk2.destroy()
            }
            if(player.anims.currentFrame.index >= 7){touchesAttack.enabled = true;}

            if(12 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
                countTest = 0
            }
        }
    });
    }
}else{}
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
                if(playerFlip === true){player.setVelocityX(-1000)}
                if(playerFlip === false){player.setVelocityX(1000)}
                touchesAttack.enabled = false; 
            }

            if(player.anims.currentFrame.index >= 8){
                touchesAttack.enabled = true; 
                colAtk2.setY(player.y - 9999)//position en dehors de l'éccran

            }
            if(10 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
            }
        }
    });
}
function jumpAction(){
   
        player.anims.play('jump', true);
        var nameAction = 'jump'
        player.on('animationupdate', ()=>{
            if(nameAction === player.anims.currentAnim.key){
                // if(player.body.touching.down ){
                //     //counterMove = 0;
                // }
            }
        });
    
}
function attackJump(){
    player.anims.play('jumpAtk', true);
    var nameAttack4 = 'jumpAtk';
    var colAtk5 = colideATK2.get();
    colAtk5.setSize(120,120)
    colAtk5.visible = false;
    attackintheair = true;
    player.on('animationupdate', ()=>{
        if(nameAttack4 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk5.setX(player.x -80);colAtk5.setY(player.y +20)}
                if(playerFlip === false){colAtk5.setX(player.x +80);colAtk5.setY(player.y +20)} 
            }
            // if(player.anims.currentFrame.index <= 8){
            //     // if(playerFlip === true){player.setVelocityX(-500)}
            //     // if(playerFlip === false){player.setVelocityX(500)}
            //     // touchesAttack.enabled = false; 
            // }
            // if(8 === player.anims.currentFrame.index){
            //     //attackintheair = false;
            //     //colAtk2.destroy();
            // }

            // // if(25 === player.anims.currentFrame.index){//reset counterMove : 0
            // //     counterMove = 0;
            // //     //touchesAttack.enabled = true;
            // // }
            if(playerInGround === true || player.anims.currentFrame.index >= 25){
                //touchesAttack.enabled = true;
                counterMove = 0; 
                colAtk5.destroy();
                // attackintheair = false
            ;}
        }
    });
}

function dieEnemyOne(enemyOne){
    enemyOne.anims.play('fallenemy1', true)
    enemyOne.on('animationupdate', ()=>{
        if(enemyOne.anims.currentFrame.index <= 2){
            enemyOne.setVelocityX(400)
        }
        if(enemyOne.anims.currentFrame.index === 4){
            enemyOne.setVelocityX(0)
        }
    })
}

function createCoin(thebox){
    var randomNbr = Phaser.Math.Between(-30,30);
    var piece = Coin.create(thebox.x + randomNbr, thebox.y + randomNbr,'piecette',0,true);
    piece.anims.play('turnPiecette',true)
    piece.setScale(3)
    piece.setBounce(1);
    piece.setVelocityX(Phaser.Math.Between(-100, 100))
   
    //setTimeout(()=>{piece.setVelocityX(0);},1000)
}
function createBox(){ //en chantier
    var woodbox = hittableObject.create(200, 200,'box',0,true);
    woodbox.setScale(3)
    woodbox.allowGravity(true)
}
function createSlash(){
    var slash = hittableObject.create(0,0,'slash',0,true);
    slash.anims.play('slashed', true)
    slash.rotation = Phaser.Math.Between(-120,120);;
    slash.setScale(3);
    slash.setData('name', 'slash');
    slash.on('animationcomplete', ()=>{
        slash.destroy();
        PlayerTouchEnemy = false
    });
    
    //console.log(slash);
}

function createEnemyOne(enemySpawner, i){
    var enemyone = hittableObject.create(Phaser.Math.Between(-500,500), enemySpawner.y,'enemy', 0, true);
    enemyone.anims.play('stancenemy1',true)
    enemyone.setSize(25, 56)
    enemyone.setScale(3);
    enemyone.setData('CounterMove', 0);
    enemyone.setData('EnemyIsAttack', false);
    enemyone.setData('EnemyIsDie', false);
    enemyone.setData('health', 5);
    enemyone.setData('name', 'EnemyOne');
}
function enemyStand(enmy1){
    enmy1.setVelocityX(0);
    enmy1.anims.play('stancenemy1',true)
    enmy1.data.list.EnemyIsAttack = true
}

function enemyWalkFront(enemy1,target,game){
    enemy1.anims.play('walkenemy1', true)
    game.physics.moveToObject(enemy1, target, 100);
    enemy1.setVelocityY(600);
    if(enemy1.body.velocity.x != 0){    //flip enemy
        if(enemy1.body.velocity.x < 0){
            enemy1.flipX = false;
        }else{enemy1.flipX = true;}
    }
}
function enemyAttack(enemyone){

    enemyone.setVelocityX(0);
    enemyone.anims.play('attackenemy1',true)
    var enemyAction = 'attackenemy1'
    enemyone.on('animationupdate', ()=>{
        if(enemyAction === enemyone.anims.currentAnim.key){
            if(enemyone.anims.currentFrame.index >= 4 &&
                enemyone.anims.currentFrame.index <= 5){
                    if(enemyone.flipX === true){enemyone.setVelocityX(400)}
                    if(enemyone.flipX === false){enemyone.setVelocityX(-400)}   
            }
            if(enemyone.anims.currentFrame.index >= 12){ 
                enemyone.data.list.CounterMove = 0

            }
        }
    });
}
function enemyKnockBack(enmy){
    enmy.data.list.EnemyIsAttack = false;
    enmy.anims.play('knockbackenemy1',true);
    var enemyAction2 = 'knockbackenemy1';
    
        enmy.on('animationupdate', ()=>{
            if(enemyAction2 === enmy.anims.currentAnim.key){
                if(enmy.anims.currentFrame.index <= 3){
                    if(enmy.flipX === true){enmy.setVelocityX(-150)}
                    if(enmy.flipX === false){enmy.setVelocityX(150)}   
                }
                if(enmy.anims.currentFrame.index >= 4){ 
                    enmy.data.list.CounterMove = 0
                }
            }
        });
    
}
function enemyDie(enmyOne){
    
    enmyOne.anims.play('fallenemy1', true);
    var enemyAction3 = 'fallenemy1';

    enmyOne.on('animationupdate', ()=>{
            if(enmyOne.anims != undefined){
            if(enemyAction3 === enmyOne.anims.currentAnim.key){
                if(enmyOne.anims.currentFrame.index <= 3){
                    if(enmyOne.flipX === true){enmyOne.setVelocityX(-150)}
                    if(enmyOne.flipX === false){enmyOne.setVelocityX(150)}   
                }
                if(enmyOne.anims.currentFrame.index >= 4){
                    enmyOne.setVelocityX(0)
                    enmyOne.body.destroy(); 
                } 
                if(enmyOne.anims.currentFrame.index >= 10){ 

                    //enmyOne.anims = null
                    // enmyOne.destroy();  
                    enmyOne.data.list.EnemyIsDie = true;
                    // EnemyIsDie = true
                }
            }
            }else{console.log(hittableObject.children.entries);}   
        });
    // if(enmyOne.anims === undefined){console.log('COUCOU JE SUIS MORT');}

}
function atkSpeOne(){
    player.anims.play('PowerSlash', true);
    
}


