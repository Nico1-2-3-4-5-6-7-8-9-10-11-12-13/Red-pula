//início do código do jogo
var red1, red_corre, red_coli;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obst1, obst2, obst3, obst4, obst5, obst6;

var gameOverImg, gameOver;
var restartImg, restart;

var count;

var jumpSom, dieSom, checkPointSom;

var PLAY=1;
var END=0;
var gameState = PLAY;

var canvas;


function preload(){
    cloudImage = loadImage("nuvem.png");
    groundImage = loadImage("chao.png");
    red_corre = loadAnimation("red_and_1.png","red_and_2.png");
    red_coli = loadImage("red_perdeu.png");

    obst1 = loadImage("picles.png");
    obst2 = loadImage("picles_picles.png");
    obst3 = loadImage("caxote_picles.png");
    obst4 = loadImage("idrante.png");
    obst5 = loadImage("idrante_agua.png");
    obst6 = loadImage("idrante_agua_picles.png");

    restartImg=loadImage("restart.png");
    gameOverImg=loadImage("gameOver.png");
    jumpSom=loadSound("jump.mp3");
    dieSom=loadSound("die.mp3");
    checkPointSom=loadSound("checkPoint.mp3");
   
}

function setup(){
    canvas = createCanvas(1000, 300);
    canvas.position(150,130);

    ground = createSprite(100,280,1000,20);
    red1 = createSprite(50,200,30,60);
    invisibleGround = createSprite(200, 250, 400, 10);
    gameOver = createSprite(520, 70);
    restart = createSprite(520, 140);

    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    ground.addImage("ground", groundImage);
    red1.addAnimation("red_corre", red_corre);
    gameOver.addImage("gameOver", gameOverImg);
    restart.addImage("restart", restartImg);
    ground.scale=0.1;
    ground.width = 375
    red1.scale=0.45;
    gameOver.scale = 1;
    restart.scale = 1.5;
    ground.x = ground.width*2
    ground.velocityX = -0.5;
    invisibleGround.visible = false;
    gameOver.visible = false;
    restart.visible = false;
    count = 0;

}

function draw(){
    background(rgb(255, 255, 255));
    if (gameState == PLAY){
        ground.velocityX = -(3+3*count/225);
        count = count + Math.round(World.frameRate/60);
        if (count>0 && count%100 === 0){
            checkPointSom.play();
        }
        if (ground.x < 0){
            ground.x = ground.width*2
        }
    }

    if (keyDown("space") && red1.y >= 210){
        red1.velocityY = -12
        jumpSom.setVolume(5.5)
        jumpSom.play();
    }
    
    red1.velocityY = red1.velocityY + 0.8
    red1.collide(invisibleGround);

    if (obstaclesGroup.isTouching(red1)){
        gameState = END;
        dieSom.play();
    }else if (gameState === END){
        gameOver.visible = true;
        restart.visible = true;

        if (mousePressedOver(restart) || keyDown("space")){
            reset();
        }
        ground.velocityX = 0;
        ground.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        red1.addAnimation("red_perdeu.png",red_coli);

        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
    }
    drawSprites();
    createClouds();
    createObstacles();
    fill(rgb(0,0,0))
    textStyle(BOLD);
    textSize(20);
    text("SCORE:" + count, 475, 50);
    
}

function createObstacles(){
    if (frameCount % 60 === 0){
        var obstacle = createSprite(1000,240,10,40);
        obstacle.velocityX = -(8+ 3*count/100);

        var rand = Math.round(random(1,6));

        switch(rand){
            case 1: obstacle.addImage(obst1);
                break;
            case 2: obstacle.addImage(obst2);
                break;
            case 3: obstacle.addImage(obst3);
                break;
            case 4: obstacle.addImage(obst4);
                 break;
            case 5: obstacle.addImage(obst5);
                 break;
            case 6: obstacle.addImage(obst6);
                 break;
            default: break;
        }
        obstacle.scale = 0.50;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle)
    }
}

function createClouds(){
    if (frameCount % 60 === 0){
        var cloud = createSprite(1200,200,10,40);
        cloud.y = Math.round(random(80,120));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -4;
        cloud.lifetime = 350;
        cloud.depth = red1.depth-2;
        red1.depth = 1+red1.depth;
        cloudsGroup.add(cloud);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    red1.addAnimation("red_and_1.png", red_corre)

    count = 0;
}


