var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstaclesGroup;
var score;
var ground;
var gameOver, GameOverSound, GameOverImage;
var reset1, resetImage;
var JumpSound;
var eatSound;


function preload() {


  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  resetImage= loadImage("1861f849-052d-447a-80ec-175a5ea54b27.png");

  GameOverImage = loadImage("42a21ff6-8e73-41be-a4d7-44901134bd0d.png");
  
  GameOverSound = loadSound("ae2da984-5f09-45b9-8a4d-8d8f9eeee058.mp3");
  JumpSound = loadSound("50955843-cdd1-4cfa-ba4a-1bdc69e0b41f.mp3");
  eatSound = loadSound("803afb91-905d-4e57-875d-1b2006a51210.mp3");
}



function setup() {
  createCanvas(400, 400);

  ground = createSprite(400, 380, 800, 20);
  ground.x = ground.width / 2;


  monkey = createSprite(50, 160, 20, 50);
  monkey.addAnimation("running", monkey_running);


  gameOver = createSprite(200, 100, 20, 20);
  gameOver.addImage(GameOverImage);

  reset1 = createSprite(200, 140, 20, 20);
  reset1.addImage(resetImage);



  monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
  monkey.debug = true;
  monkey.scale=0.1;


  gameOver.scale = 0.5;
  reset1.scale = 0.5;


  obstaclesGroup = new Group();
  FoodGroup = new Group();

  score = 0;

}


function draw() {

  background("white");
  
  monkey.collide(ground);

  // ground.velocityX = -3;

  if (ground.x < 0) {
    ground.x = ground.width / 2;

  }


  if (FoodGroup.isTouching(monkey)) {
    FoodGroup.destroyEach();
    // score = score + 8;
  }
  
  fill(0);
  textSize(18);
  text("Survival Time: " + score, 200, 50);


  if (gameState === PLAY) {

    gameOver.visible = false;
    reset1.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //scoring
    score = score + Math.round(getFrameRate() / 60);


    //jump when the space key is pressed
    if (keyDown("space") && monkey.y >= 100) {
      monkey.velocityY = -12;
      JumpSound.play();
    }

    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;


    //spawn obstacles on the ground
    spawnObstacles();
    spawnBanana();

    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    reset1.visible = true;


    if (mousePressedOver(reset1)) {
      reset();
    }

    ground.velocityX = 0;
    monkey.velocityY = 0;


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);


  }


  drawSprites();


}

function reset() {
  // console.log("game is restarted");
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  FoodGroup.destroyEach();
  monkey.changeAnimation("running", monkey_running);
}

function spawnObstacles() {
  
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 365, 10, 40);
    obstacle.velocityX = -(6 + score / 100);
    obstacle.addImage(obstacleImage);

    //generate random obstacles
    var rand = Math.round(random(1, 6));

    obstacle.scale = 0.1;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}

function spawnBanana() {
  
  //write code here to spawn the food
  if (frameCount % 60 === 0) {
    banana = createSprite(600, 120, 40, 10);
    banana.y = Math.round(random(80, 120));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -3;

    //assign lifetime to the variable
    banana.lifetime = 200;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    FoodGroup.add(banana);
  }
}

