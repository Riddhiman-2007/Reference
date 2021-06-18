var ghost , ghostImage ,ghostImage2; 
var tower , towerImage ; 
var climberImage , climbersGroup ; 
var doorImage , doorsGroup ; 
var invisibleBlock , invisibleBlockGroup ; 
var spookySound ;
var gameState , playerCount ; 
var database ;
var score = 0 ;
var index ; 
var position1 ;
var position2 ;
function preload(){
  
  ghostImage = loadImage("ghost-standing.png");
  ghostImage2 = loadImage("ghost-jumping.png")
  towerImage = loadImage("tower.png");
  doorImage = loadImage("door.png");
  climberImage = loadImage("climber.png");
  spookySound = loadSound("spooky.wav");
  
}

function setup(){
  createCanvas(displayWidth,displayHeight);
  
  database = firebase.database()
  getGameState()
  getPlayerCount()
  
  title = createElement('h1')
  input = createInput('Name')
  button = createButton('Play')
  greet = createElement('h1')

  player1 = createSprite(displayWidth/2+200 , displayHeight/2)
  player1.addImage(ghostImage)
  player1.scale = 0.7;
  player2 = createSprite(displayWidth/2-200 , displayHeight/2)
  player2.addImage(ghostImage2)
  player2.scale = 0.7;

  updatePosition(player1.x,player1.y);
  updatePosition(player2.x,player2.y);
  getPlayerInfo();
}

function draw(){
  if(gameState === 0){
  
  title.html("Ghost Runner Game")   
  title.position(displayWidth/2 , 50)
  input.position(displayWidth/2 , 150)
  button.position(displayWidth/2+170 , 150)
  button.mousePressed(function(){
    playerCount = playerCount+1
    updateCount(playerCount)
    updatePlayer(playerCount)
    index = playerCount ;
    button.hide()
    input.hide()
    greet.html(" Welcome " + input.value())
    greet.position(displayWidth/2 , 150)
    if(playerCount === 2){
      gameState = 1
      updateState(gameState)
    }
  })
  }
    if(gameState === 1){
      background(towerImage)
      title.hide();
      greet.hide();
      if(index === 1){
        updatePosition(player1.x,player1.y)
        getPlayerInfo()
        player2.x = position2.x
        player2.y = position2.y
        if(keyDown(LEFT_ARROW)){
        player1.x-= 3
        }
        if(keyDown(RIGHT_ARROW)){
          player1.x+= 3
          
          }
        if(keyDown("space")){
          player1.velocityY = -15
          }
        player1.velocityY += 0.5
      }
      if(index === 2){
        console.log(position1)
        updatePosition(player2.x,player2.y)
        getPlayerInfo()
        console.log(position1)
        player1.x = position1.x
        player1.y = position1.y
        if(keyDown(LEFT_ARROW)){
        player2.x-= 3
        }
        if(keyDown(RIGHT_ARROW)){
          player2.x+= 3
          }
        if(keyDown("space")){
          player2.velocityY = -15
          }
        player2.velocityY += 0.5
      }
      drawSprites();

    }
    
 
  }
function getGameState(){

  database.ref("gameState").on("value",function(data){
  gameState = data.val()
})
console.log(gameState)
} 

function getPlayerCount(){
  
    database.ref("playerCount").on("value",function(data){
    playerCount = data.val()
  })
 
}
function updateCount(count){
     database.ref('/').update({playerCount : count})
}

function updateState(state){
  database.ref('/').update({gameState : state})
}

function updatePlayer(count){
  var playerIndex = 'players/player'+count
  database.ref(playerIndex).set({
    name: input.value(),
    score:score
});
}
function updatePosition(x,y){
  var playerIndex = 'players/player'+index+'/position'
  if(index === 1){
    database.ref(playerIndex).set({
    x:x,y:y
    })
  }
  if(index === 2){
    database.ref(playerIndex).set({
    x:x,y:y
    })
  }
  
}
function getPlayerInfo(){
  database.ref('players/player1/position').on("value",function(data){
  position1 = data.val()
  })
  database.ref('players/player2/position').on("value",function(data){
  position2 = data.val()
  })
}