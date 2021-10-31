var PLAY= 1;
var END= 0;
var gamestate= PLAY;

var car, carAccident, carImg;
var road, roadImg;

var obstacle1, obstacle2, obstacle3, police, cones, screws, puddle;

var score;
var gameOverImg, restartImg, gameOver, restart;

var obstacleG;

var checkpoint,die


function preload(){
  carImg = loadImage("Main car.png")
  carAccident= loadImage("car accident.png")
  
  roadImg= loadImage("Road.png")

  obstacle1= loadImage("Obstacle 1.png")
  obstacle2= loadImage("Obstacle 2.png")
  obstacle3= loadImage("Obstacle 3.png")
  police= loadImage("Police car.png")
  cones= loadImage("cones.png")
  screws= loadImage("screws.png")
  puddle= loadImage("puddle.png")

  gameOverImg= loadImage("gameOver.png")
  restartImg= loadImage("restart.png")

  checkpoint = loadSound("checkpoint.mp3")
  die = loadSound("die.mp3")


}

function setup() {

  createCanvas(400,600);

  road= createSprite(200,200);
  road.addImage(roadImg);


  //create main car
  car= createSprite(200,580,20,20);
  car.addImage(carImg);
   car.scale= 0.1;

  //create the gameover  and restart sprites
  gameOver= createSprite(200,300,20,20);
  gameOver.addImage(gameOverImg);
  gameOver.scale= 0.7;

  restart= createSprite(200,350,20,20);
  restart.addImage(restartImg);
  restart.scale= 0.5;

  score= 0 

 //Create the obstacle, police, cone, screw and puddle groups
  obstacleG= new Group()
}

function draw() {

 if(gamestate===PLAY){
     background(0)
     car.x= World.mouseX

     gameOver.visible= false
     restart.visible= false

     edges= createEdgeSprites();
     car.collide(edges);

     //code to reset background
     if(road.y > 400){
        road.y= height/2
     }

     road.velocityY= (4 + 3* score/100)

     //scoring
     score= score + Math.round(getFrameRate()/60)
     
     if(score>0 && score%100 === 0){
        checkpoint.play() 
     }

     //functions to spawn obstacles and cars
     spawnObstacles()
     spawnCars()
     spawnConepuddlescrew()

     //if condition to bring gamestates to end if touch obstacles
     if(obstacleG.isTouching(car)){
         gamestate= END
         car.addImage(carAccident)
     }

 }

 else{
     if(gamestate===END){
        gameOver.visible= true
        restart.visible= true
        die.play()

        road.velocityY= 0 
        car.velocityY= 0
        car.velocityX= 0

        //set lifetime of the obsactle group
        obstacleG.setLifetimeEach(-1)

        obstacleG.setVelocityYEach(0)
        
        if(mousePressedOver(restart)){
           reset();
        }
     }
 }
drawSprites()
textSize(20);
fill(255);
text("Score: "+ score,10,30);
}

function spawnObstacles(){
    if(frameCount% 60===0){
        var obstacle=  createSprite(Math.round(random(50,350),40,10,10))
        obstacle.velocityY= (6 + score/100)

        var rand= Math.round(random(1,2))
        switch(rand){
            case 1: obstacle.addImage(obstacle1);
                    break;
            case 2: obstacle.addImage(obstacle2)
                    break;
            default: break;
        }
        
        //set lifetime and scale for obstacle 
        obstacle.scale= 0.5;
        obstacle.lifetime= 150;

        //add obstacle in obstacles group
        obstacleG.add(obstacle)
    }
}

function spawnCars(){
    if(frameCount % 210===0){
        var cars= createSprite(Math.round(random(50,350), 40, 10, 10))
        cars.velocityY= (6 + score/100)

        var select= Math.round(random(3,4))
        switch(select){
            case 3: cars.addImage(police)
                    break;
            case 4: cars.addImage(obstacle3)
                    break;
            default: break;
        }

        //set lifetime and scale for cars
        cars.scale= 0.2;
        cars.lifetime= 150

        //add cars in obstacles group
        obstacleG.add(cars)
    }
}

function spawnConepuddlescrew(){
    if(frameCount % 360===0){
       var cps= createSprite(Math.round(random(50,350), 40, 10, 10))
       cps.velocityY= (6 + score/100)

       var choose= Math.round(random(5, 6, 7))
       switch(choose){
           case 5: cps.addImage(cones)
                   break;
            case 6: cps.addImage(puddle)
                   break;
            case 7: cps.addImage(screws)
                   break;
       }

       //set lifetime and scale for cps
       cps.scale= 0.08
       cps.lifetime= 150

       //add cps in obstacles group
       obstacleG.add(cps)
    }
}

function reset(){
    gamestate= PLAY
    gameOver.visible= false
    restart.visible= false
    obstacleG.destroyEach()
    score= 0
    car.addImage(carImg)
}
