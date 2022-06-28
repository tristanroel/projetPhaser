var configuration = {
    type: Phaser.AUTO,
    pixelArt : true,
    width : 800,
    height : 600,
    //backgroundColor : '#FFFFFF',
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
                    //debug : true,
                    gravity : {y : 1000}
                }
    }
}

var game = new Phaser.Game(configuration);
var touchesClavier;
var touchesAttack;
//var player;
//var timedEvent
var counterMove;
var attackOneDuree;
var box;
var playerFlip;
var colideATK1; // collision attaque 1
var colideATK2; // collision attaque 1

var isjump;


function preload(){
    this.load.image('sky','assets/cloud.png');
    this.load.image('ground','assets/solPave.png');
    this.load.image('ATK1','assets/TRlogo.png');
    this.load.spritesheet('hero', 'assets/heroidleright.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('heroAttack', 'assets/herocomboright.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('herorun', 'assets/herorunright.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('herojump', 'assets/jumpright.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('herojumpAtk', 'assets/jumpingAttack.png',{frameWidth: 100, frameHeight: 100});
    this.load.spritesheet('box', 'assets/box.png',{frameWidth: 62, frameHeight: 62});

}

///////////////////////////////////////////////////////////////////////////////////// CREATE
function create(){

    var skyBg = this.add.image(200, 200,'sky').setScale(3); //background

    var sol1 = this.add.sprite(200, 570, 'ground').setScale(3);//image sol
    var sol2 = this.add.sprite(1200, 500, 'ground').setScale(3);//image sol
    
    box = this.physics.add.group({
        key : 'box',
        repeat : 10,
        setXY:{x: 50, y :60, stepX: 200},
        setScale : {x : 3},
    }); //caisse en bois
    box.children.iterateLocal('setSize', 35,35)

    player = this.physics.add.sprite(200, 310,'hero').setScale(3);// player
    player.body.setSize(20, 45 ) // hitbox player
    // player.setCollideWorldBounds(true); // definit si le player touche les limites du monde

    colideATK1 = this.physics.add.group({
        key : 'ATK1',
        //maxSize : 12,
        active : false,
        visible : false,
        enable : false,
        //collideWorldBounds : true,
        bounceX : 0.5,
        bounceY : 0.5,
        dragX : 0,
        dragY : 0,
    });
    colideATK2 = this.add.sprite({
        key : 'ATK1',
        active : false,
        visible : false,
        enable : false,
        setXY : {}
    })

    

    
    //Camera
    this.cameras.main.startFollow(player);       


    //Collision
    var platform = this.physics.add.staticGroup();//définit la valeur d'une plateforme
        platform.add(sol1)//asigne
        platform.add(sol2)//asigne

        this.physics.add.collider(platform,player)//collision entre la plateforrme et le joueur 
        this.physics.add.collider(platform,box , function(platform, box){
            
            
        })//collision entre la plateforrme et le joueur 
        this.physics.add.collider(box, player, function (box,player){})//collision entre la plateforrme et le joueur 
        this.physics.add.overlap(colideATK1, box, function (colideATK1, box){
            box.anims.play('damageLast', true)
            console.log('oulah');
        })
        
        this.physics.add.overlap(box, colideATK1, destroyCollideBox, null, this)
        this.physics.add.overlap(box, box, function(box, box){
            //box.setBounceY(box.x / 10)
            //console.log(box.x);
        })

        

    counterMove = 0;
    attackOneDuree = 3000;

    
    //Touches joueurs

    touchesClavier = this.input.keyboard.addKeys('left, up, down, right');
    touchesAttack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //animation player
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('hero',{frames: [0, 1, 2, 3]}),
        frameRate: 4,
        repeat: -1
    })
    this.anims.create({
        key: 'runRight',
        frames: this.anims.generateFrameNumbers('herorun',{frames: [0, 1, 2, 3]}),
        frameRate: 8,
        //repeat: -1
    })
    this.anims.create({
        key: 'runLeft',
        frames: this.anims.generateFrameNumbers('herorun',{frames: [0, 1, 2, 3]}),
        frameRate: 8,
        //repeat: -1
    })
    firstAtk = this.anims.create({
        key: 'attackOne',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [0, 1, 2, 3, 4, 5, 5, 5]}),
        frameRate: 14,
        //repeat: -1
    })
    

    this.anims.create({
        key: 'attackTwo',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [6, 7, 8, 9, 10, 10, 10]}),
        frameRate: 13,
        //repeat: -1
    })
    this.anims.create({
        key: 'attackThree',
        frames: this.anims.generateFrameNumbers('heroAttack',{frames: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}),
        frameRate: 12,
        //repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('herojump',{frames: [0, 1, 0, 1, 2, 3, 2, 3]}),
        frameRate: 12,
        //repeat: -1
    });
    this.anims.create({
        key: 'jumpAtk',
        frames: this.anims.generateFrameNumbers('herojumpAtk',{frames: [0, 1, 2, 3, 4, 5, 6,7]}),
        frameRate: 12,
        //repeat: -1
    });

    // animation box
    this.anims.create({
        key: 'damageOne',
        frames: this.anims.generateFrameNumbers('box',{frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
        frameRate: 15,
        //repeat: -1
    });
    this.anims.create({
        key: 'damageLast',
        frames: this.anims.generateFrameNumbers('box',{frames: [12, 17, 18, 19, 20, 21, 22, 23]}),
        frameRate: 15,
        //repeat: -1
    });
    
    
}

function collideBox(playerx, playery){
    var ctk = colideATK1.get();
        if(!ctk) return;
        if(playerFlip === true){ctk.enableBody(true, playerx -122,playery,true, true)}
        if(playerFlip === false){ctk.enableBody(true, playerx +122,playery,true, true)}
        // ctk.enableBody(true, playerx,playery,true, true)

}

function destroyCollideBox(player,cAtk){
    cAtk.disableBody(true,true);
}

//////////////////////////////////////////////////////////////////////////////////////////////// UPDATE

function update(time, delta){

    box.setVelocityX(0);

    // console.log(counterMove);
    // console.log(isjump);

    if (touchesClavier.left.isDown && counterMove === 0){
            player.setVelocityX(-350);
            playerFlip = player.flipX=true;

            if(player.body.touching.down){
                player.anims.play('runLeft', true);
            }
        }
    else if (touchesClavier.right.isDown && counterMove === 0){
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
    
    if (touchesClavier.up.isDown && player.body.touching.down){
            player.setVelocityY(-500);
            jumpAction();
        }

    if(Phaser.Input.Keyboard.JustDown(touchesAttack)){
        console.log(touchesAttack);
        counterMove = counterMove + 1;
        if(counterMove === 1){attackComboOne();}
        if(counterMove === 2){attackComboTwo();}
        if(counterMove === 3){attackComboThree();}
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
    }
    else{
        player.anims.play('jumpAtk', true);

    }
        var nameAttack = 'attackOne'
        //console.log(player.anims.currentAnim.key);// key of attackOne
    
            player.on('animationupdate', ()=>{
               
                // if(playerFlip === false){ colideATK1 = this.add.image(player.x +112, player.y -0, 'ATK1')}
                if(nameAttack === player.anims.currentAnim.key){
                    if(3 === player.anims.currentFrame.index){
                        //APPARITION DU COLLIDER ATTACK
                        collideBox(player.x,player.y)
                    };
                    if(player.anims.currentFrame.index <= 4){
                        if(playerFlip === true){player.setVelocityX(-1000)}
                        if(playerFlip === false){player.setVelocityX(1000)}
                        touchesAttack.enabled = false; 
                    }
                    if(player.anims.currentFrame.index >= 5){
                        touchesAttack.enabled = true; 
                    }
                    if(8 === player.anims.currentFrame.index){//reset counterMove : 0
                        //console.log('badaboom');
                        counterMove = 0;
                    }
                }
                //console.log(player.anims.currentFrame.index);
            })
}
function attackComboTwo(){
    console.log('deux');
    player.anims.play('attackTwo', true);
    var nameAttack2 = 'attackTwo'
   
    player.on('animationupdate', ()=>{
        if(nameAttack2 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 3){
                if(playerFlip === true){player.setVelocityX(-1200)}
                if(playerFlip === false){player.setVelocityX(1200)}
                touchesAttack.enabled = false; 
            }
            if(player.anims.currentFrame.index >= 4){
                touchesAttack.enabled = true; 
            }
            if(7 === player.anims.currentFrame.index){//reset counterMove : 0
                counterMove = 0;
            }
        }
    });
}
function attackComboThree(){
    player.anims.play('attackThree', true);
    var nameAttack3 = 'attackThree'

    player.on('animationupdate', ()=>{
        if(nameAttack3 === player.anims.currentAnim.key){
            if(player.anims.currentFrame.index <= 6){
                if(playerFlip === true){player.setVelocityX(-1000)}
                if(playerFlip === false){player.setVelocityX(1000)}
                touchesAttack.enabled = false; 
            }
            if(player.anims.currentFrame.index >= 7){
                touchesAttack.enabled = true; 
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
                touchesAttack.enabled = true;
            }
        }
    });
}

