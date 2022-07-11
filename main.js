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

var touchesClavier; //touches de direction
var touchesAttack; // touche d'attaque

var gamepad;
//var player;
var counterMove; // compteur combo attack : number
var attackOneDuree;
var box; // caisse en bois : sprite
var boxHealth; //vie des caisses(provisoire) : number
var playerFlip; // direction du joueur : boulean
var colideATK1; // collision attaque 1 : sprite
var colideATK2; // collision attaque 1 : sprite

var attackintheair; // verifie si peut attaquer en l'air : boolean

var skyBg; //ciel
var Coin; //pieces
var text; // info command list
var Score = 0; // Score
var scoreText;



function preload(){
    this.load.image('sky','assets/Thesky.png');
    this.load.image('ground','assets/solPave.png');
    this.load.image('ATK1','assets/TRlogo.png');
    this.load.spritesheet('skyAnim', 'assets/Bakcloudanim.png', {frameWidth : 404, frameHeight : 274});
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
    var sol2 = this.add.sprite(1412, 500, 'ground').setScale(3);//image sol

    Coin = this.physics.add.group({ // piecettes
        //key :'piecette',
        setXY:{x: -800, y :60},
        visible : false,
    });

    box = this.physics.add.group({ //caisse en bois
        key : 'box',
        name : 'woodBox',
        repeat : 4,
        setXY:{x: -100, y :60, stepX: 500},
        setScale : {x : 3},
    });
    box.children.iterateLocal('setData', 'pv', 4)
    box.children.iterateLocal('setSize', 35,35)
    
    var enemy = this.physics.add.group({   //enemy
        key :'theEnemy',
        setXY:{x: 400, y :366},
        setScale : {x : 3}
    });
    enemy.children.iterateLocal('setData', 'pv', 5)
    enemy.children.iterateLocal('setSize', 26,56)


    player = this.physics.add.sprite(200, 310,'hero').setScale(3); // player
    player.body.setSize(25, 58) // hitbox player
    

    colideATK2 = this.physics.add.group({ // collision attaque
        key : 'ATK1',
        allowGravity : false,
        disableBody : true,
        //setScale : {x : 3},
        //enable : false,
        //active : false,
        visible : false,
        setXY : {x : -999, y : -999}
    })

    //info control text
    text = this.add.text(-150,510, '╔══════════════╗\n║ << CONTROL >> \n║ ← = press "Q"\n║ → = press "D"\n║ ↑  = press "Z"\n║\n║ 🗡 = press "J"\n╚══════════════╝' , {font : '16px Courier'});
   
    scoreText = this.add.text(10,10, 'SCORE : 0',{ font : '16px Arial Black', color : '#353535'})
    console.log(colideATK2);
    var boxHealth = 4;
    //////////////////////
    
    //CAMERA
    this.cameras.main.startFollow(player);




    //COLISIONS
    var platform = this.physics.add.staticGroup();// groupe plateforme
        platform.add(sol1)//asigne
        platform.add(sol2)//asigne

        this.physics.add.collider(platform,player)//collision entre la plateforrme et le joueur 
        this.physics.add.collider(platform,box) //collision plateforme et boites
        this.physics.add.collider(box,box, function(box2, box1){ // collisions entre boites
            if(playerFlip === false){}
            //box1.setVelocityX(5)
            //player.x = 0;
        })
        this.physics.add.overlap(Coin, player, function(theplayer, piepiece){ // collision pieces et joueur 
            Score++;
            piepiece.destroy();
            console.log('Score : '+Score);
            })
        this.physics.add.collider(platform,enemy)
        this.physics.add.collider(box, player, function (box,player){box.setVelocityX(0);player.setVelocityX(0)})//collision entre box et le joueur 
        this.physics.add.collider(Coin, platform)

        this.physics.add.overlap(colideATK2, enemy, function(colAtk2, theEnemy){ // collision attaque sur l'enemy
            colAtk2.destroy();
            theEnemy.data.list.pv = theEnemy.data.list.pv - 1;
            theEnemy.anims.play('knockbackenemy1', true);

            player.anims.pause();
            setTimeout(()=>{player.anims.resume()},200)
            console.log('ouille !!!');
            if(theEnemy.data.list.pv <= 0){
                // theEnemy.anims.play('fallenemy1', true);
                dieEnemyOne(theEnemy);
                enemyPlayerContact.active = false;
                setTimeout(()=>{theEnemy.destroy()},2000)            }
        });

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

        var enemyPlayerContact = this.physics.add.collider(enemy,player, function(enemy, player){ //collision entre l'enemy et le joueur 
            player.setVelocityX(0)
            enemy.setVelocityX(0)
            // console.log(box.children.entries);
            //console.log(box.children.entries.length);
            //console.log(laboite.data.list.pv);
            console.log('enculax : '+playerFlip);
            
        });
        
    attackintheair = false;
    counterMove = 0;
    attackOneDuree = 3000;

    
    //Touches joueurs / ENTREE CLAVIER

    touchesClavier = this.input.keyboard.addKeys('Q, Z, S, D'); //direction
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
  
    gamepad = this.input.gamepad.on('down', function(pad, button, index){
        gamepad = pad
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
        frameRate: 22,
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
        frames: this.anims.generateFrameNumbers('herojump',{frames: [0,0,0,0, 1]}),
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
        key: 'knockbackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [8 ,9 ,9, 0]}),
        frameRate: 9,
        
    });
    this.anims.create({
        key: 'fallenemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [0, 1, 2, 3, 3, 3]}),
        frameRate: 8,
    });

    this.anims.create({
        key: 'turnPiecette',
        frames: this.anims.generateFrameNumbers('piecette',{frames: [0, 1, 2, 3]}),
        frameRate: 8,
        repeat: -1
    });


    // coin.getChildren().forEach(function() {
    //skyBgAnim.anims.play('lescloud', true)
    //coin.anims.play('turnPiecette', true);
    //coin.setOrigin(box.x, box.y)   
    //enemy.anims.play('stancenemy1', true);
    // coin.playAnimation('turnPiecette');


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

    skyBg.x = player.body.position.x // position du ciel
    text.x = player.body.position.x - 350;
    text.y = player.body.position.y + 250;
    scoreText.x = player.body.position.x + 250;
    scoreText.y = player.body.position.y + -180;
    scoreText.setText('SCORE : '+ Score)
    
    skyBg.tilePositionX += 0.5;

    console.log(counterMove);

    // console.log(attackintheair);

    if (touchesClavier.Q.isDown && counterMove === 0){
            player.setVelocityX(-350);
            playerFlip = player.flipX=true;

            if(player.body.touching.down){
                player.anims.play('runLeft', true);
            }
        }
    else if (touchesClavier.D.isDown && counterMove === 0){
            player.setVelocityX(350);
            playerFlip = player.flipX=false;
           
            if(player.body.touching.down){
                player.anims.play('runRight', true);
            }
        }
    else if (player.setVelocityX(0)){
            if(player.body.touching.down && counterMove === 0){
                player.anims.play('idle', true);
            }
        }
    
    if (Phaser.Input.Keyboard.JustDown(touchesClavier.Z) && player.body.touching.down && counterMove === 0 || //jump
         gamepad.A && player.body.touching.down && counterMove === 0){ //gamepad
        // console.log(gamepad);
        // console.log(gamepad.gamepads);
            player.setVelocityY(-500);
            jumpAction();
        }

    if (touchesGuard.isDown && player.body.touching.down && counterMove === 0){ //guard
        //counterMove = 20;
        player.anims.play('guard', true);
        

        console.log('yeye');
    }
    
    if(Phaser.Input.Keyboard.JustDown(touchesAttack)){ //attack
        counterMove = counterMove + 1;
        if(counterMove === 1){attackComboOne();}
        if(counterMove === 2){attackComboTwo();}
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
    
    if(player.body.touching.down){
        player.anims.play('attackOne', true);

        var nameAttack = 'attackOne'
        var colAtk2 = colideATK2.get();
        colAtk2.visible = false;

        //console.log(player.anims.currentAnim.key);// key of attackOne
    
            player.on('animationupdate', ()=>{
               
                // if(playerFlip === false){ colideATK1 = this.add.image(player.x +112, player.y -0, 'ATK1')}
                if(nameAttack === player.anims.currentAnim.key){
                    if(4 === player.anims.currentFrame.index){
                        //APPARITION DU COLLIDER ATTACK
                            //collideBox(player.x,player.y)
                            if(playerFlip === true){colAtk2.setX(player.x -130);colAtk2.setY(player.y);}
                            if(playerFlip === false){colAtk2.setX(player.x +130);colAtk2.setY(player.y)}
                            
                    };

                    if(5 === player.anims.currentFrame.index){
                        
                        // player.anims.pause();
                        // setTimeout(()=>{
                        //     player.anims.resume()
                        //     console.log('salutation');
                        // },200)
                    }

                    if(player.anims.currentFrame.index <= 2){
                        // if(playerFlip === true){player.setVelocityX(-1000)}
                        // if(playerFlip === false){player.setVelocityX(1000)}
                        touchesAttack.enabled = false;
                        gamepad.enabled = false;
                    }
                    if(player.anims.currentFrame.index >= 6){
                        touchesAttack.enabled = true;
                        gamepad.enabled = true; 
                        colAtk2.destroy()

                    }
                    if(13 === player.anims.currentFrame.index){//reset counterMove : 0
                        counterMove = 0;
                    }
                }
            })
    }
    else if(!player.body.touching.down && attackintheair === false){
                attackJump()
                attackintheair = true;
    }
}
function attackComboTwo(){
    //console.log('deux');
    player.anims.play('attackTwo', true);
    var nameAttack2 = 'attackTwo'
    var colAtk2 = colideATK2.get();
    colAtk2.visible = false;

   
    player.on('animationupdate', ()=>{
        if(nameAttack2 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 3){
                // if(playerFlip === true){player.setVelocityX(-1200)}
                // if(playerFlip === false){player.setVelocityX(1200)}
                touchesAttack.enabled = false;
                gamepad.enabled = false; 
            }
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk2.setX(player.x -130);colAtk2.setY(player.y)}
                if(playerFlip === false){colAtk2.setX(player.x +130);colAtk2.setY(player.y)}
            }
            if(player.anims.currentFrame.index >= 5){
                touchesAttack.enabled = true;
                gamepad.enabled = true;
                colAtk2.destroy()
            }
            if(14 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
            }
        }
    });

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
            if(player.anims.currentFrame.index <= 6){
                // counterMove = 99;
            }
            if(8 >= player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
                //touchesAttack.enabled = true;
            }
        }
    });
}
function attackJump(){
    player.anims.play('jumpAtk', true);
    var nameAttack4 = 'jumpAtk';
    var colAtk2 = colideATK2.get();
    colAtk2.visible = false;

    player.on('animationupdate', ()=>{
        if(nameAttack4 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk2.setX(player.x -150);colAtk2.setY(player.y +50)}
                if(playerFlip === false){colAtk2.setX(player.x +150);colAtk2.setY(player.y +50)} 
                
            }
            if(player.anims.currentFrame.index <= 8){
                if(playerFlip === true){player.setVelocityX(-500)}
                if(playerFlip === false){player.setVelocityX(500)}
                touchesAttack.enabled = false; 
            }
            if(8 === player.anims.currentFrame.index){
                //attackintheair = false;
                colAtk2.destroy();
            }

            if(25 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
                //touchesAttack.enabled = true;
            }
            if(player.body.touching.down){touchesAttack.enabled = true;counterMove = 0; attackintheair = false;}
           
            
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
    var randomNbr = Phaser.Math.Between(-20,30);
    var piece = Coin.create(thebox.x + randomNbr, thebox.y + randomNbr,'piecette',0,true);
    piece.anims.play('turnPiecette',true)
    piece.setScale(3)
    piece.setBounce(1);
    piece.setVelocityX(Phaser.Math.Between(-100, 100))
   
    //setTimeout(()=>{piece.setVelocityX(0);},1000)
}

function atkSpeOne(){
    player.anims.play('PowerSlash', true);
    
}


