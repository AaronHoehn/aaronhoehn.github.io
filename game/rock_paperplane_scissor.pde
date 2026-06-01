////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Rock Paperplane Scissor, Final Assignment, Aaron Höhn, 1121152, ER-T1 WISE 2022 Fundamentals of Technology in Expanded Realities ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* @pjs preload="..data/classRoomParalax.png, ..data/rockImage.png"; */

// Minim audio library installed to play sounds
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import ddf.minim.signals.*;
import ddf.minim.spi.*;
import ddf.minim.ugens.*;

int screenX = 600;
int screenY = 800;
color playerColor = color (255, 255, 255);
color backgroundColor = color(0);
// time
float deltaTime;
float gameTime = 0f;

color pillarColor = color (120, 120, 120);
int score = 0;
boolean debug = false;
float pillarRange = screenX*1.5 + 40;
float objectSpeed = 120f;
boolean skinUnlocked = false;
boolean showUnlockText = false;
int skinUnlockScore = 10;
float unlockTextDuration = 5f;
float unlockTextTime;

// soundfiles
Minim minim;
AudioPlayer scissorSound;
AudioPlayer stonePickedUp;
AudioPlayer skinUnlockSound;
AudioPlayer jumpSound;
AudioPlayer scoreSound;


ParallaxBackground background;
Player player1 = new Player (screenX/2, screenY/2, 35, 'w', 10, 1.2);
Pillar pillar1 = new Pillar (150, screenX, 80, pillarColor, 50, objectSpeed);
Pillar pillar2 = new Pillar (150, pillarRange, 80, pillarColor, 50, objectSpeed);

enum Skins {
  basicSkin,
  nightHawk
}
Skins skin = Skins.basicSkin;

enum GameState {
  MainMenu,
  Running,
  GameOver
}

GameState gameState = GameState.MainMenu;


void settings() {
  size(screenX, screenY);
}

void setup() {
  // Pfad für die Web-Verzeichnisstruktur angepasst
  background = new ParallaxBackground(screenY, 50, "game/data/classRoomParalax.png");
  minim = new Minim(this);
  scissorSound = minim.loadFile("scissorSound.mp3");
  stonePickedUp = minim.loadFile("stonePickedUp.mp3");
  skinUnlockSound = minim.loadFile("skinUnlockSound.mp3");
  jumpSound = minim.loadFile("jumpSound.mp3");
  scoreSound = minim.loadFile("scoreSound.wav");
}

void draw() {
  deltaTime = 1f / frameRate;
  gameTime += deltaTime;

  // only update if game is running
  if (gameState == GameState.Running) {
    background.update();

    pillar1.updatePillar();
    pillar2.updatePillar();
    checkScoreCount();
    checkUnlockTextTimer();

    for (int i = rocks.size() - 1; i >= 0; i--) {
      rocks.get(i).update();
    }

    player1.updatePlayer();
  }

  // visuals
  background.drawBackground();
  pillar1.drawPillar();
  pillar2.drawPillar();
  drawUnlockText();

  for (int i = 0; i < rocks.size(); i++) {
    rocks.get(i).drawRock();
  }

  player1.drawPlayer();


  // Menu Screens
  switch(gameState) {
  case MainMenu:
    drawMainMenu();
    break;
  case Running:
    drawScore();
    break;
  case GameOver:
    drawGameOverScreen();
    break;
  default:
    break;
  }
}

void keyPressed() {
  switch(gameState) {
  case MainMenu:
    gameState = GameState.Running;
    break;
  case Running:
    player1.captureInput();
    changeSkin();
    break;
  case GameOver:
    if (key=='r')
      restartGame();
    break;
  default:
    break;
  }
}

void drawScore() {
  fill(255, 255, 255);
  textSize(30);
  text("score: " + score, 20, 25);
}


void restartGame() {
  gameState = GameState.MainMenu;
  score = 0;
  pillar1.hasCountedScore = false;
  pillar2.hasCountedScore = false;
  scissorSound.pause();
  scissorSound.rewind();

  //reset player and pillar pos
  player1.onGameRestart();
  pillar1.posX = screenX;
  pillar2.posX = pillarRange;

  //reset pillarSizeY
  pillar1.pillarSizeY = random(pillar1.minPillar, screenY - pillar1.gap - pillar1.minPillar);
  pillar2.pillarSizeY = random(pillar2.minPillar, screenY - pillar2.gap - pillar2.minPillar);

  rocks = new ArrayList<Rock>();
}

// --------- skin logic ----------

void checkScoreCount() {
  if (score >= skinUnlockScore && !skinUnlocked) {
    skinUnlocked = true;
    skinUnlockSound.play();
    skin = Skins.nightHawk;
    setUnlockTextTimer();
  }
}

void changeSkin() {
  if (skinUnlocked) {
    if (key == 'e') {
      skin = Skins.nightHawk;
    }
    if (key == 'q') {
      skin = Skins.basicSkin;
    }
  }
}

void setUnlockTextTimer() {
  unlockTextTime = gameTime + unlockTextDuration;
  showUnlockText = true;
}

void checkUnlockTextTimer() {
  if (!skinUnlocked) return;

  if (gameTime >= unlockTextTime) {
    showUnlockText = false;
    skinUnlockSound.pause();
    skinUnlockSound.rewind();
  }
}

void drawUnlockText() {
  if (showUnlockText) {
    textSize(40);
    fill(255, 255, 255);
    text("Night Hawk unlocked!", screenX - 460, 65);
  }
}

// --------- Menu Screens -----------

void drawMainMenu() {
  fill(0, 0, 0, 150);
  rect(0, 0, screenX, screenY);
  fill(255, 255, 255);
  textSize(55);
  text("Rock Paperplane Scissor", screenX/25, screenY/8);
  textSize(45);
  text("press any key to start", screenX/6, screenY/2.5);
  textSize(40);
  text("press r to restart", screenX/4, screenY/1.3);
  text("press w to jump", screenX/4, screenY/1.4);
  textSize(25);
  text("reach a score of " + skinUnlockScore + " to unlock a new skin", screenX/6, screenY * 0.9);
  text("change the skin with q and e", screenX/6, screenY * 0.94);
}

void drawGameOverScreen() {
  fill(0, 0, 0, 150);
  rect(0, 0, screenX, screenY);
  fill(255, 255, 255);
  textSize(40);
  text("Your score: " + score, screenX/4, screenY/1.4);
  text("press r to restart", screenX/4, screenY/1.3);
  textSize(100);
  text("game over!", screenX/7, screenY/2);
}

// --------- rock logic ------------

ArrayList<Rock> rocks = new ArrayList<Rock>();
int pillarsTillRockSpawn = 4;
int currentPillarCount = 0;
float rockRadius = 50f;
float rockDistanceToPillar = 100f;

public void onPillarRespawned(Pillar respawnedPillar) {
  currentPillarCount++;
  if (currentPillarCount >= pillarsTillRockSpawn) {
    float x = respawnedPillar.posX + respawnedPillar.pillarWidth + rockRadius + rockDistanceToPillar;
    float y = random(screenY * 0.2f, screenY * 0.8f);
    // Pfad für das Rock-Image für die Web-Verzeichnisstruktur angepasst
    rocks.add(new Rock(x, y, rockRadius, objectSpeed, "game/data/rockImage.png"));
    currentPillarCount = 0;
  }
}



// -----------------------------------------------------------------------------

// Player

public class Player {
  float posX;
  float posY;
  float radius;
  float velocityY = 0f;
  char jumpKey;
  float jump;
  float gravity = 9.81f;
  float velRange = 10f;
  float angleRange = PI/2;
  float playerScale = 1f;
  
  //invincibility
  boolean isInvincible = false;
  float invincibilityDuration = 3f;
  float invincibilityTimer;

  public Player(float posX, float posY, float radius, char jumpKey, float jump, float playerScale) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius * playerScale;
    this.jumpKey = jumpKey;
    this.jump = jump;
    this.playerScale = playerScale;
  }

  void updatePlayer() {
    wallCollision();
    pillarCollision();
    applyGravity();
    checkInvincibility();
    movePlayer();
  }

  public void drawPlayer() {
    strokeWeight(1);
    pushMatrix();
    translate(this.posX,this.posY);
    
    float angle = map(this.velocityY,-this.velRange, this.velRange,-this.angleRange, this.angleRange);
    rotate(constrain(angle, -this.angleRange, this.angleRange));
    
    //hitbox
    if(debug){
      ellipse(0, 0, this.radius, this.radius);
    }
    scale(this.playerScale);
    
    //skin basic
    if(skin == Skins.basicSkin){
    color c1 = !this.isInvincible ? color(200,200,200) : color(219,209,10);
    color c2 = !this.isInvincible ? color(150,150,150) : color(163,151,20);
    color c3 = !this.isInvincible ? color(100,100,100) : color(138,122,15);
    //left wing
    fill(c1);
    triangle(-20, -15, 25, 0, -15, 0);
    fill(c2);
    triangle(-15, 0, 25, 0, -15, 20);
    //small wing
    fill(c3);
    triangle(-3, 0, 25, 0, 0, 15);
    fill(c1);
    triangle(-15, 0, 25, 0, -10, 12);
    }
    
    //skin nightHawk
    if(skin == Skins.nightHawk){
    color b1 = !this.isInvincible ? color(100,100,100) : color(219,209,10);
    color b2 = !this.isInvincible ? color(60,60,60) : color(163,151,20);
    color b3 = !this.isInvincible ? color(50,50,50) : color(138,122,15);
    //left wing
    fill(b1);
    quad(-20, -15, -5, -11, -15, -20, -22, -22);
    triangle(-20, -15, 25, 0, -15, 0);
    fill(b2);
    triangle(-15, 0, 25, 0, -15, 20);
    //small wing
    fill(b3);
    quad(5, 0, 26, 0, 32, 9, 0, 0);
    triangle(-3, 0, 25, 0, 0, 15);
    //right wing
    fill(b1);
    triangle(-15, 0, 25, 0, -10, 12);
    quad(-15, 13, 0, 8, -10, 3, -19, 4);
    }
    
    popMatrix(); 
    
    
    
    if(this.isInvincible) {
      int secondsLeft = ceil(this.invincibilityTimer - gameTime);
      
      fill(255, 255, 255);
      textSize(30);
      text("Invincible: " + secondsLeft + "s", screenX - 200, 25);
    }
  }
  
  void applyGravity() {
    this.velocityY += this.gravity * 1.5f * deltaTime;
  }
  
  void movePlayer() {
    this.posY += this.velocityY;
  }
  
  void captureInput() {
    if(key == jumpKey){
      this.velocityY -= this.jump;
      jumpSound.pause();
      jumpSound.rewind();
      jumpSound.play();
    }
  }
  
  void wallCollision() {
     if (this.posY - this.radius/2 < 0 || this.posY + this.radius > screenY) {
       gameState = GameState.GameOver;
     }
  }
  
  void pillarCollision() {
     if(this.isInvincible) return;
     
     // pillar 1
     if(this.posX + this.radius/2 > pillar1.posX && this.posX -radius/2< pillar1.posX + pillar1.pillarWidth && this.posY-radius/2