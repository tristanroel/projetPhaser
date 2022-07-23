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
var attackintheair; // verifie si attaque en l'air : boolean
var attackinground;
var playerCanFall; // : boolean

var enemySpawn; //spawn enemy
//var enemyNumber;
var enemyCollideATK;

var box; // caisse en bois : sprite

var skyBg; //ciel
var Coin; //pieces
var text; // info command list
var Score = 0; // Score
var scoreText;
var healthBar; 


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
    this.load.spritesheet('heroProtectGuard', 'assets/Sprites/Playerkbtest.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('heroKnockBack', 'assets/Sprites/KnockBacktest.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('shoryu', 'assets/Sprites/shoryu.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('powerSlash', 'assets/PowerSlash.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('box', 'assets/box.png',{frameWidth: 62, frameHeight: 62});
    this.load.spritesheet('theEnemy', 'assets/Enemy/enemiaxe1.png',{frameWidth: 170, frameHeight: 170});
    this.load.spritesheet('theEnemyfall', 'assets/Enemy/enemi1falling.png',{frameWidth: 170, frameHeight: 170});

}

///////////////////////////////////////////////////////////////////////////////////// CREATE
function create(){

    
   //OBJECT

    skyBg = this.add.tileSprite(0, 400, 404, 542, 'sky').setScale(3); //image ciel
    var sol1 = this.add.sprite(200, 570, 'ground').setScale(3);//image sol
    var sol2 = this.add.sprite(1412, 500, 'ground').setScale(3);//image sol
    enemySpawn = this.add.image(1900, 100, 'spawner'); //spawn enemy
    
    healthBar = this.add.rectangle(0,0,200,10,0xB14F37).setStrokeStyle(2, 0xFFFFFF);
    Coin = this.physics.add.group({ // piecettes
        //key :'piecette',
        setXY:{x: -800, y :60},
        visible : false,
    });

    hittableObject = this.physics.add.group()

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
    
    player = this.physics.add.sprite(200, 310,'hero').setScale(3); // player
    player.body.setSize(25, 58) // hitbox player
    player.setData('health', 10)
    player.setData('Guard', false)
    player.setData('Eject', false)
    //console.log(player);
    

    colideATK2 = this.physics.add.group({ // collision attaque
        key : 'ATK1',
        allowGravity : false,
        disableBody : true,
        visible : false,
        data : {'Eject': false}
        // size : {x : 200, y : 200}
        //setXY : {x : -999, y : -999}
    })
    //colideATK2.children.iterateLocal('setData', 'eject', false)

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
            
            
            // if(thebox.body.touching.right || thebox.body.touching.left){
            //     theplayer.anims.play('runRight', true)
            //     counterMove = 0;
            //     playerInGround = true
            //     //console.log(theplayer.body.angle);
            // }
            if(thebox.body.touching.up && theplayer.body.touching.down){
                playerInGround = true;
                thebox.setGravityY(-1)
            }
            // else{playerInGround = false;}
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
    attackinground = false;
    playerCanFall = true;
    
    
    //Touches joueurs / ENTREE CLAVIER
    leftkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    rightkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    upkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    //touchesClavier = this.input.keyboard.addKeys('Q, Z, S, D'); //direction
    touchesAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); //attack
    touchesGuard = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Guard

    var tornadoSlashLeft = this.input.keyboard.createCombo([83, 68, 74], {resetOnMatch:true, maxKeyDelay:700}); //300ms pour taper le combo, sinon se reinitialise
    var tornadoSlashRight = this.input.keyboard.createCombo([83, 81, 74], {resetOnMatch:true, maxKeyDelay:700}); 

    this.input.keyboard.on('keycombomatch', function(combo){ //verification du secialAtk entré
        if((combo === tornadoSlashLeft || tornadoSlashRight )&& player.body.touching.down && counterMove === 0){
            console.log('connaldemelde');
            counterMove = 32;
            tornadoSlash();
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
        key: 'protectGuard',
        frames: this.anims.generateFrameNumbers('heroProtectGuard',{frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4]}),
        frameRate: 8,
        //repeat: -1
    });
    this.anims.create({
        key: 'knockBack',
        frames: this.anims.generateFrameNumbers('heroKnockBack',{frames: [0, 1, 2, 2, 1, 1, 1, 1, 1, 1]}),
        frameRate: 8,
    });
    this.anims.create({
        key: 'shoryuSlash',
        frames: this.anims.generateFrameNumbers('shoryu',{frames: [0, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]}),
        frameRate: 12,
    });
    this.anims.create({
        key: 'PowerSlash',
        frames: this.anims.generateFrameNumbers('powerSlash',{frames: [0 ,1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}),
        frameRate: 16,
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
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [1]}),
        frameRate: 6,
    });
    this.anims.create({
        key: 'walkenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [1, 2, 3, 4]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'walkbackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1]}),
        frameRate: 4,
        repeat : -1,
    });
    this.anims.create({
        key: 'attackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [4, 5, 5, 6, 7, 7, 7, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0]}),
        frameRate: 8,
    });
    this.anims.create({
        key: 'knockbackenemy1',
        frames: this.anims.generateFrameNumbers('theEnemy',{frames : [ 8, 9, 9, 9, 9, 9, 0]}),
        frameRate: 9,
    });
    this.anims.create({
        key: 'fallenemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [0, 1, 2, 3, 3, 3, 3, 3, 3, 3]}),
        frameRate: 8,
    })
    this.anims.create({
        key: 'ejectenemy1',
        frames: this.anims.generateFrameNumbers('theEnemyfall',{frames : [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3]}),
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
        frames: this.anims.generateFrameNumbers('slash',{frames: [0, 1, 2, 2]}),
        frameRate: 25,
    });


    // coin.getChildren().forEach(function() {
    //skyBgAnim.anims.play('lescloud', true)
    //coin.anims.play('turnPiecette', true);
    //coin.setOrigin(box.x, box.y)   
    //enemy.anims.play('stancenemy1', true);
    //enemy.playAnimation('attackenemy1');
    
    for(var i = 0;i < 5; i++){
        setTimeout(()=>{createEnemyOne(enemySpawn, i);},9000 + (i * 7000))
    }
    createEnemyOne(enemySpawn, player, this);
    //console.log(enemySpawn);
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
    healthBar.x = player.body.position.x - 230; //position healthbar
    healthBar.y = player.body.position.y - 180;
    healthBar.width = player.data.list.health * 20;
    scoreText.x = player.body.position.x + 250; //position Score
    scoreText.y = player.body.position.y -180;
    scoreText.setText('SCORE : '+ Score) // maj score

    //ENEMY UPDATE
    for(var i = 0; i < hittableObject.children.entries.length; i++){
        if(hittableObject.children.entries[i] != undefined && hittableObject.children.entries[i].data.list.name === 'EnemyOne'){
            
            var currentEnemy = hittableObject.children.entries[i];

            this.physics.add.collider(currentEnemy, player, function(htblobjct, plyr){  // collision Enemy + player
                // if(htblobjct.body.touching.up){
                //     if(plyr.flipX === false){}
                //     if(plyr.flipX === true){}
                // }
                console.log(htblobjct.body)
                if((htblobjct.body.touching.left || 
                    htblobjct.body.touching.right) && 
                    htblobjct.data.list.AtkCollide === false){
                    //console.log('touché lenemi');
                    counterMove = 14;
                    GuardKnockBack()
                }
                
                if(htblobjct.data.list.AtkCollide === true){
                    htblobjct.data.list.AtkCollide = false;
                    if(plyr.data.list.Guard === true){
                        if(plyr.flipX === false && htblobjct.flipX === false){
                            counterMove = 14;
                            GuardKnockBack()
                            console.log('protegé des attaques de droite');
                        }
                        else if(plyr.flipX === true && htblobjct.flipX === true){
                            counterMove = 14;
                            GuardKnockBack()
                            
                            plyr.anims.play('protectGuard', true)
                            console.log('protegé des attaques de gauche')
                            console.log(plyr.body.velocity);
                        }
                        else{
                            plyr.data.list.health = plyr.data.list.health - 1
                            counterMove = 28
                            KnockBack(htblobjct);
                            console.log('coup dans l\'dos');
                        }
                    }else{
                        plyr.data.list.health = plyr.data.list.health - 1
                        counterMove = 28
                        KnockBack(htblobjct)
                        console.log('aille !');
                    }
                }
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
            
            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) >= 202 && 
            currentEnemy.data.list.AttackIsFinish === true){
                currentEnemy.data.list.CounterMove = 1; 
                currentEnemy.data.list.EnemyIsAttack = true; 
            }
            if(Phaser.Math.Distance.BetweenPoints(currentEnemy,player) <= 198 && 
            currentEnemy.data.list.EnemyIsAttack === true && 
            currentEnemy.data.list.AttackIsFinish === true){
                currentEnemy.data.list.AttackIsFinish = false
                currentEnemy.data.list.EnemyIsAttack = false
                if(currentEnemy.data.list.randomValue % 2 === 1){
                    currentEnemy.data.list.CounterMove = 5;
                    currentEnemy.data.list.randomValue = currentEnemy.data.list.randomValue + 1;
                }else{
                    currentEnemy.data.list.CounterMove = 2;
                    currentEnemy.data.list.randomValue = currentEnemy.data.list.randomValue + 1;
                }
            }
            if(currentEnemy.data.list.health <= 0){currentEnemy.data.list.CounterMove = 4}
            if(currentEnemy.data.list.CounterMove === 0){enemyStand(currentEnemy)}
            if(currentEnemy.data.list.CounterMove === 1){enemyWalkFront(currentEnemy,player,this)};
            if(currentEnemy.data.list.CounterMove === 5){enemyWalkBack(currentEnemy,player,this)};
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
        // else if(hittableObject.children.entries[i].data.list.name === 'enemyAttack'){ 
        //     if(currentEnemy.flipX === true){
        //         hittableObject.children.entries[i].x = currentEnemy.x + 150
        //         hittableObject.children.entries[i].y = currentEnemy.y
        //     }else{
        //         hittableObject.children.entries[i].x = currentEnemy.x - 150
        //         hittableObject.children.entries[i].y = currentEnemy.y
        //     }
        //  }
        else{hittableObject.children.entries[i] = [];} 
    }
    //console.log(Phaser.Math.Distance.BetweenPoints(hittableObject.children.entries[0],player));
    //console.log(enemyMoveDetection.children.entries[0]);
    //enemyMoveDetection.children.entries[0].body.destroy()
    //console.log(theGamePad);
    //console.log(PlayerTouchEnemy);
    //console.log(colideATK2);
    //console.log(counterMove);
    //console.log(returnRandomNumber(10, 20));
    //console.log('AtkCollide : '+ hittableObject.children.entries[0].data.list.AtkCollide);
    //console.log(player.data.list.Eject);
    //console.log(box.children.entries);
    //console.log(playerInGround);
    //console.log(hittableObject.children.entries);
    //console.log(hittableObject.children.entries[0].body.position.x);
    //console.log(currentEnemy);
    //console.log(player.anims.currentAnim);
    //console.log(player.anims.currentAnim);
    //console.log('countTest : '+countTest);
    //console.log(attackintheair);
    //console.log(attackinground);
    //console.log(EnemyIsDie);
    //console.log(player.body.velocity.y);
    //console.log(playerCanFall);
        if(player.data.list.health <= 0){
            counterMove = 999; 
            player.data.list.health = 0;
            // player.body.destroy()
        }
        if (leftkey.isDown && counterMove === 0 || theGamePad.left && counterMove === 0){              //left
                player.setVelocityX(-playerVelocityX);
                playerFlip = player.flipX=true;
                if(playerInGround === true){
                    player.anims.play('runLeft', true);
                }
            }
        else if (rightkey.isDown && counterMove === 0 || theGamePad.right && counterMove === 0){       //right
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
        if(player.body.velocity.y > 0 &&                                                                //fall
            attackintheair === false &&                                    
            counterMove != 28 && 
            counterMove != 14 && 
            playerCanFall === true &&
            attackinground === false){               
            fallAction()
            playerInGround = false
        }     
        
        if (touchesGuard.isDown && playerInGround === true && counterMove === 0){                       //guard
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('guard', true);
            player.data.list.Guard = true
        }else{ player.data.list.Guard = false}
        
        if(Phaser.Input.Keyboard.JustDown(touchesAttack)){                                              //attack
            counterMove++;
            if(counterMove === 1 && playerInGround === true){attackComboOne();}
            else if (counterMove >= 2 && playerInGround === true){attackComboTwo();}
            else if(counterMove === 1 && playerInGround === false){attackJump();}
            //else{counterMove = 0}
            //if(counterMove === 3){attackComboThree();}  
        }    
}

function attackComboOne(){
        attackinground = true;
        var nameAttack = 'attackOne'
        player.anims.play(nameAttack, true);
        var colAtk2 = colideATK2.get();
        colAtk2.setSize(120,120)
        colAtk2.visible = false;
            player.on('animationupdate', ()=>{
                if(nameAttack === player.anims.currentAnim.key){
                    if(4 === player.anims.currentFrame.index){
                            if(playerFlip === true){colAtk2.setX(player.x -90);colAtk2.setY(player.y);}
                            if(playerFlip === false){colAtk2.setX(player.x +90);colAtk2.setY(player.y)}      
                    };
                    if(player.anims.currentFrame.index >= 6){
                        colAtk2.destroy()
                    }
                    if(player.anims.currentFrame.index >= 7){
                        countTest = 1
                    };
                    if(13 === player.anims.currentFrame.index){
                        counterMove = 0;
                        attackinground = false;
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
            }
            if(player.anims.currentFrame.index === 4){
                if(playerFlip === true){colAtk2.setX(player.x -90);colAtk2.setY(player.y)}
                if(playerFlip === false){colAtk2.setX(player.x +90);colAtk2.setY(player.y)}
            }
            if(player.anims.currentFrame.index >= 5){
                colAtk2.destroy()
            }
            if(12 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
                countTest = 0;
                attackinground = false;
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
}
function fallAction(){
        player.anims.play('fall', true)   
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
            if(playerInGround === true || player.anims.currentFrame.index >= 25){
                counterMove = 0; 
                colAtk5.destroy();
            ;}
        }
    });
}
function tornadoSlash(){
    playerCanFall = false;
    console.log(player.body.checkCollision);
    player.anims.play('shoryuSlash', true);
    var nameAttack = 'shoryuSlash';
    var colAtk = colideATK2.get().setSize(120,120);
    var colAtkTwo = colideATK2.get().setSize(120,120);
    var colAtkThree = colideATK2.get().setSize(120,120);
    colAtk.visible = false;
    colAtkTwo.visible = false;
    colAtkThree.visible = false;
    player.on('animationupdate', ()=>{
        if(nameAttack === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index < 3 ){
                player.body.checkCollision.right = false;
                player.body.checkCollision.left = false;
            }
            if(player.anims.currentFrame.index <= 3 ){
                if(playerFlip === true){player.setVelocityX(-2000)}
                if(playerFlip === false){player.setVelocityX(2000)} 
            }
            if(player.anims.currentFrame.index === 2 ){
                // player.anims.stop()
                if(playerFlip === true){colAtk.setX(player.x -130);colAtk.setY(player.y +20)}
                if(playerFlip === false){colAtk.setX(player.x +130);colAtk.setY(player.y +20)} 
            }
            if(player.anims.currentFrame.index === 4 ){
                player.body.checkCollision.right = true;
                player.body.checkCollision.left = true;
                colAtk.destroy();
                player.data.list.Eject = true;
                if(playerFlip === true){colAtkTwo.setX(player.x -90);colAtkTwo.setY(player.y -65)}
                if(playerFlip === false){colAtkTwo.setX(player.x +90);colAtkTwo.setY(player.y -65)} 
            }
            if(player.anims.currentFrame.index === 6 ){
                colAtkTwo.destroy();
                if(playerFlip === true){colAtkThree.setX(player.x -50);colAtkThree.setY(player.y -150)}
                if(playerFlip === false){colAtkThree.setX(player.x +50);colAtkThree.setY(player.y -150)} 
            }
            if(player.anims.currentFrame.index === 7 ){colAtkThree.destroy();}
            if(player.anims.currentFrame.index >= 4 &&
                player.anims.currentFrame.index <= 6){
                    player.setVelocityY(-350)
            }
            if(player.anims.currentFrame.index >= 16){
                player.data.list.Eject = false;
                if(player.body.velocity.y != 0){
                    playerCanFall = false
                }else{
                    playerCanFall = true;
                    counterMove = 0;
                }
                
            }
        }
    });

}
function KnockBack(enemy){
    player.data.list.Eject = false;
    playerCanFall = false
    player.anims.play('knockBack', true);
    var nameAction = 'knockBack';
    player.on('animationupdate', ()=>{
        if(nameAction === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <=4){
                if(enemy.flipX === true){
                    player.flipX = true
                    player.setVelocityX(800)
                }
                if(enemy.flipX === false){
                    player.flipX = false
                    player.setVelocityX(-800)
                } 
            }
            if(player.anims.currentFrame.index >=5){
                if(player.body.velocity.y != 0){
                    playerCanFall = false
                }else{
                    playerCanFall = true;
                    counterMove = 0;
                }
            }
        }
    });
}

function GuardKnockBack(){
    player.data.list.Eject = false;
    playerCanFall = false
    player.anims.play('protectGuard', true);
    var nameAction = 'protectGuard';
    player.on('animationupdate', ()=>{
        if(nameAction === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <=4){
                if(playerFlip === true){player.setVelocityX(800)}
                if(playerFlip === false){player.setVelocityX(-800)} 
            }
            if(player.anims.currentFrame.index >=5){
                if(player.body.velocity.y != 0){
                    playerCanFall = false
                }else{
                    playerCanFall = true;
                    counterMove = 0;
                }
            }
            
        }
    });
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
    slash.rotation = Phaser.Math.Between(0,2);;
    slash.setScale(3);
    slash.setData('name', 'slash');
    slash.on('animationcomplete', ()=>{
        slash.destroy();
        PlayerTouchEnemy = false
    });
    
    //console.log(slash);
}

function createEnemyOne(enemySpawner, i){
    var enemyone = hittableObject.create(enemySpawner.x, enemySpawner.y,'enemy', 0, true);
    enemyone.anims.play('stancenemy1',true)
    enemyone.setSize(25, 56)
    enemyone.setScale(3);
    enemyone.setData('CounterMove', 0);
    enemyone.setData('EnemyIsAttack', false);
    enemyone.setData('AttackIsFinish', true);
    enemyone.setData('AtkCollide', false);
    enemyone.setData('EnemyIsDie', false);
    enemyone.setData('health', 5);
    enemyone.setData('name', 'EnemyOne');
    enemyone.setData('randomValue',Phaser.Math.Between(50,200));
    // enemyone.body.touching.up = false;
    // console.log(enemyone);
    enemyone.setDepth(0)
}
function enemyStand(enmy1){
    enmy1.setVelocityX(0);
    //enmy1.anims.play('stancenemy1',true)
    enmy1.data.list.EnemyIsAttack = true
}

function enemyWalkFront(enemy1,target,game){
    enemy1.anims.play('walkenemy1', true)
    game.physics.moveToObject(enemy1, target, enemy1.data.list.randomValue);
    enemy1.setVelocityY(600);
    if(enemy1.body.velocity.x != 0){    //flip enemy
        if(enemy1.body.velocity.x < 0){
            enemy1.flipX = false;
        }else{enemy1.flipX = true;}
    }
}

function enemyWalkBack(enemy1,target,game){
    
    enemy1.anims.play('walkbackenemy1', true)
    game.physics.moveToObject(enemy1, target, -(enemy1.data.list.randomValue));
    enemy1.data.list.AttackIsFinish = false
    enemy1.setVelocityY(600);
    var enemyAction = 'walkbackenemy1';
    enemy1.on('animationupdate', ()=>{
        if(enemyAction === enemy1.anims.currentAnim.key){
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

function enemyAttack(enemyone){
    enemyone.setVelocityX(0);
    enemyone.anims.play('attackenemy1',true)
    var enemyAction = 'attackenemy1'
    enemyone.on('animationupdate', ()=>{
        if(enemyAction === enemyone.anims.currentAnim.key){
            if(enemyone.anims.currentFrame.index >= 4 &&
                enemyone.anims.currentFrame.index <= 6){
                    if(enemyone.flipX === true){enemyone.setVelocityX(400)}
                    if(enemyone.flipX === false){enemyone.setVelocityX(-400)}
            }
            if(enemyone.anims.currentFrame.index === 5){
                enemyone.data.list.AtkCollide = true
                enemyone.setSize(100,56)
                setTimeout(()=>{
                    enemyone.setSize(24,56)
                    enemyone.data.list.AtkCollide = false
                },50)
            }
            
            if(enemyone.anims.currentFrame.index >= 6){
                // eColAtk.destroy();
            }
            if(enemyone.anims.currentFrame.index >= 12){ 
                enemyone.data.list.CounterMove = 0
                enemyone.data.list.AttackIsFinish = true

            }
        }
    });
}
function enemyKnockBack(enmy){
    if(player.data.list.Eject === false){
        enmy.data.list.EnemyIsAttack = false;
        enmy.anims.play('knockbackenemy1',true);
        var enemyAction2 = 'knockbackenemy1';
        
            enmy.on('animationupdate', ()=>{
                if(enemyAction2 === enmy.anims.currentAnim.key){
                    if(enmy.anims.currentFrame.index <= 3){
                        if(enmy.flipX === true){enmy.setVelocityX(-50)}
                        if(enmy.flipX === false){enmy.setVelocityX(50)}   
                    }
                    if(enmy.anims.currentFrame.index >= 6 &&
                        player.data.list.Eject === false){ 
                        enmy.data.list.CounterMove = 0
                        enmy.data.list.AttackIsFinish = true
                        console.log('et tac');
                    }
                }
            });
    }else{
        enmy.data.list.EnemyIsAttack = false;
        enmy.anims.play('ejectenemy1',true);
        var enemyAction3 = 'ejectenemy1';
        enmy.data.list.CounterMove = 77
            enmy.on('animationupdate', ()=>{
                if(enemyAction3 === enmy.anims.currentAnim.key){
                    if(enmy.anims.currentFrame.index <= 5){
                        if(enmy.flipX === true){
                            enmy.setVelocityX(-100)
                            enmy.setVelocityY(-400)
                        }
                        if(enmy.flipX === false){
                            enmy.setVelocityX(100)
                            enmy.setVelocityY(-400)
                        }   
                    }
                    if(enmy.anims.currentFrame.index >= 6 &&
                        enmy.anims.currentFrame.index <= 7){
                            enmy.setVelocityX(200)
                            enmy.setVelocityY(0)
                        }
                        if(enmy.anims.currentFrame.index >= 8 &&
                            enmy.anims.currentFrame.index <10){
                            enmy.setVelocityX(100)
                            enmy.setVelocityY(500)
                            enmy.setBounce(0.5,0.5)
                        }
                    if(enmy.anims.currentFrame.index > 10){
                        enmy.setVelocityX(0)
                        enmy.setBounce(0,0)                       
                    }
                    if(enmy.anims.currentFrame.index >= 20 &&
                        enmy.body.velocity.y === 0){ 
                            enmy.setVelocityX(0)
                            
                            console.log('fdp');
                        enmy.data.list.CounterMove = 0
                        enmy.data.list.AttackIsFinish = true
                    }
                }
            });
    }
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
                    enmyOne.setVelocityY(600)
                    enmyOne.body.destroy(); 
                } 
                if(enmyOne.anims.currentFrame.index >= 10){ 
                    enmyOne.data.list.EnemyIsDie = true;
                }
            }
            }else{console.log(hittableObject.children.entries);}   
        });
}

function atkSpeOne(){
    player.anims.play('PowerSlash', true);
    
}
function returnRandomNumber(number1,number2){
    // setTimeout(()=>{
        var randomNbr = 0;
        randomNbr = Phaser.Math.Between(number1,number2);
    // }, 1000)

    return randomNbr
}


