////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Rock Paperplane Scissor, Final Assignment, Aaron Höhn, 1121152 | Umbau auf p5.js (Pure JavaScript)                               ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let screenX = 600;
let screenY = 800;
let playerColor;
let backgroundColor;

let deltaTimeSeconds; 
let gameTime = 0;

let pillarColor;
let score = 0;
let debug = false;
let pillarRange;
let objectSpeed = 120;
let skinUnlocked = false;
let showUnlockText = false;
let skinUnlockScore = 10;
let unlockTextDuration = 5;
let unlockTextTime;

const Skins = {
  BASIC: 'basicSkin',
  NIGHTHAWK: 'nightHawk'
};
let skin = Skins.BASIC;

const GameState = {
  MAIN_MENU: 'MainMenu',
  RUNNING: 'Running',
  GAME_OVER: 'GameOver'
};
let gameState = GameState.MAIN_MENU;

let bgController;
let player1;
let pillar1;
let pillar2;
let rocks = [];

let pillarsTillRockSpawn = 4;
let currentPillarCount = 0;
let rockRadius = 50;
let rockDistanceToPillar = 100;

// Assets
let classRoomParallaxImg;
let rockImg;

// Koordinaten für die UI-Buttons auf Mobilgeräten
let restartBtn = { x: 0, y: 0, w: 200, h: 55 };
let skinBasicBtn = { x: 0, y: 0, w: 140, h: 45 };
let skinHawkBtn = { x: 0, y: 0, w: 140, h: 45 };

function preload() {
  // Pfade beziehen sich auf die HTML-Datei (Projects/RockPaperplaneScissor.html)
  classRoomParallaxImg = loadImage('../game/data/classRoomParalax.png');
  rockImg = loadImage('../game/data/rockImage.png');
}

function setup() {
  let canvas = createCanvas(screenX, screenY);
  canvas.parent('game-container');
  
  playerColor = color(255, 255, 255);
  backgroundColor = color(0);
  pillarColor = color(120, 120, 120);
  pillarRange = screenX * 1.5 + 40;

  bgController = new ParallaxBackground(screenY, 50, classRoomParallaxImg);
  player1 = new Player(screenX / 2, screenY / 2, 35, 'w', 5.5, 1.2);
  pillar1 = new Pillar(150, screenX, 80, pillarColor, 50, objectSpeed);
  pillar2 = new Pillar(150, pillarRange, 80, pillarColor, 50, objectSpeed);

  // Button-Positionen dynamisch berechnen
  restartBtn.x = screenX / 2 - restartBtn.w / 2;
  restartBtn.y = screenY / 1.35 - restartBtn.h / 2;

  skinBasicBtn.x = screenX / 2 - skinBasicBtn.w - 15;
  skinBasicBtn.y = screenY * 0.78;
  skinHawkBtn.x = screenX / 2 + 15;
  skinHawkBtn.y = screenY * 0.78;
}

function draw() {
  deltaTimeSeconds = deltaTime / 1000;
  gameTime += deltaTimeSeconds;

  if (gameState === GameState.RUNNING) {
    bgController.update();

    pillar1.updatePillar();
    pillar2.updatePillar();
    checkScoreCount();
    checkUnlockTextTimer();

    for (let i = rocks.length - 1; i >= 0; i--) {
      rocks[i].update();
    }

    player1.updatePlayer();
  }

  bgController.drawBackground();
  pillar1.drawPillar();
  pillar2.drawPillar();
  drawUnlockText();

  for (let i = 0; i < rocks.length; i++) {
    rocks[i].drawRock();
  }

  player1.drawPlayer();

  switch (gameState) {
    case GameState.MAIN_MENU:
      drawMainMenu();
      break;
    case GameState.RUNNING:
      drawScore();
      break;
    case GameState.GAME_OVER:
      drawGameOverScreen();
      break;
  }
}

// =============================================================================
// STEUERUNG (PC & MOBIL)
// =============================================================================

function keyPressed() {
  if (gameState === GameState.RUNNING) {
    player1.captureInput();
    changeSkin();
  } else if (gameState === GameState.GAME_OVER) {
    if (key === 'r' || key === 'R') {
      restartGame();
    }
  }
}

function touchStarted() {
  // Prüfen, ob der Klick/Touch innerhalb des Spielfelds liegt
  if (mouseX >= 0 && mouseX <= screenX && mouseY >= 0 && mouseY <= screenY) {
    
    // 1. Interaktionen im Hauptmenü
    if (gameState === GameState.MAIN_MENU) {
      if (skinUnlocked && mouseInButton(skinBasicBtn)) {
        skin = Skins.BASIC;
      } else if (skinUnlocked && mouseInButton(skinHawkBtn)) {
        skin = Skins.NIGHTHAWK;
      } else {
        gameState = GameState.RUNNING;
      }
    } 
    
    // 2. Interaktionen während des Spiels (Tippen = Fliegen)
    else if (gameState === GameState.RUNNING) {
      player1.jumpPressed();
    } 
    
    // 3. Interaktionen im Game-Over-Bildschirm
    else if (gameState === GameState.GAME_OVER) {
      if (skinUnlocked && mouseInButton(skinBasicBtn)) {
        skin = Skins.BASIC;
      } else if (skinUnlocked && mouseInButton(skinHawkBtn)) {
        skin = Skins.NIGHTHAWK;
      } else if (mouseInButton(restartBtn)) {
        restartGame();
      } else {
        // Klick irgendwo anders hin startet als Komfort-Fallback ebenfalls neu
        restartGame();
      }
    }
    
    return false; // Verhindert Scrollen/Zoomen auf Mobilgeräten
  }
}

// Hilfsfunktion zur Überprüfung von Klicks auf UI-Elemente
function mouseInButton(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h;
}

function drawScore() {
  fill(255, 255, 255);
  noStroke();
  textSize(30);
  textAlign(LEFT, TOP);
  text("score: " + score, 20, 25);
}

function restartGame() {
  gameState = GameState.MAIN_MENU;
  score = 0;
  pillar1.hasCountedScore = false;
  pillar2.hasCountedScore = false;

  player1.onGameRestart();
  pillar1.posX = screenX;
  pillar2.posX = pillarRange;

  pillar1.pillarSizeY = random(pillar1.minPillar, screenY - pillar1.gap - pillar1.minPillar);
  pillar2.pillarSizeY = random(pillar2.minPillar, screenY - pillar2.gap - pillar2.minPillar);

  rocks = [];
}

function checkScoreCount() {
  if (score >= skinUnlockScore && !skinUnlocked) {
    skinUnlocked = true;
    skin = Skins.NIGHTHAWK;
    setUnlockTextTimer();
  }
}

function changeSkin() {
  if (skinUnlocked) {
    if (key === 'e' || key === 'E') {
      skin = Skins.NIGHTHAWK;
    }
    if (key === 'q' || key === 'Q') {
      skin = Skins.BASIC;
    }
  }
}

function setUnlockTextTimer() {
  unlockTextTime = gameTime + unlockTextDuration;
  showUnlockText = true;
}

function checkUnlockTextTimer() {
  if (!skinUnlocked) return;
  if (gameTime >= unlockTextTime) {
    showUnlockText = false;
  }
}

function drawUnlockText() {
  if (showUnlockText) {
    textSize(35);
    fill(0, 255, 204);
    noStroke();
    textAlign(RIGHT, TOP);
    text("Night Hawk unlocked!", screenX - 40, 65);
  }
}

function drawMainMenu() {
  fill(0, 0, 0, 170);
  rect(0, 0, screenX, screenY);
  fill(255, 255, 255);
  noStroke();
  textAlign(CENTER, CENTER);
  
  textSize(42);
  text("Rock Paperplane Scissor", screenX / 2, screenY / 6);
  
  // Pulsierender Starttext für Mobil-Look
  let pulse = map(sin(frameCount * 0.08), -1, 1, 200, 255);
  fill(0, 255, 204, pulse);
  textSize(32);
  text("Click to play", screenX / 2, screenY / 2.5);
  
  fill(255, 255, 255);
  textSize(24);
  text("", screenX / 2, screenY / 1.6);
  
  textSize(16);
  fill(160, 174, 192);
  text("Reach " + skinUnlockScore + " points for a new skin", screenX / 2, screenY * 0.90);
  
  if (skinUnlocked) {
    drawSkinSelectionButtons();
  }
}

function drawGameOverScreen() {
  fill(0, 0, 0, 180);
  rect(0, 0, screenX, screenY);
  
  // Game Over Text
  fill(255, 75, 75);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(75);
  text("game over!", screenX / 2, screenY / 2.3);
  
  // Score Anzeige
  fill(255, 255, 255);
  textSize(32);
  text("Your Score: " + score, screenX / 2, screenY / 1.65);

  if (skinUnlocked) {
    drawSkinSelectionButtons();
  }
}

// Zeichnet mobile Buttons für die Skinauswahl
function drawSkinSelectionButtons() {
  push();
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(255);
  text("Select Skin:", screenX / 2, screenY * 0.73);
  
  // Basic Skin Button
  stroke(skin === Skins.BASIC ? color(0, 255, 204) : color(100));
  fill(skin === Skins.BASIC ? color(0, 255, 204, 30) : color(20, 24, 30));
  rect(skinBasicBtn.x, skinBasicBtn.y, skinBasicBtn.w, skinBasicBtn.h, 6);
  noStroke();
  fill(skin === Skins.BASIC ? color(0, 255, 204) : color(200));
  textSize(16);
  text("Basic", skinBasicBtn.x + skinBasicBtn.w/2, skinBasicBtn.y + skinBasicBtn.h/2);
  
  // Night Hawk Button
  stroke(skin === Skins.NIGHTHAWK ? color(0, 255, 204) : color(100));
  fill(skin === Skins.NIGHTHAWK ? color(0, 255, 204, 30) : color(20, 24, 30));
  rect(skinHawkBtn.x, skinHawkBtn.y, skinHawkBtn.w, skinHawkBtn.h, 6);
  noStroke();
  fill(skin === Skins.NIGHTHAWK ? color(0, 255, 204) : color(200));
  text("Night Hawk", skinHawkBtn.x + skinHawkBtn.w/2, skinHawkBtn.y + skinHawkBtn.h/2);
  pop();
}

function onPillarRespawned(respawnedPillar) {
  currentPillarCount++;
  if (currentPillarCount >= pillarsTillRockSpawn) {
    let x = respawnedPillar.posX + respawnedPillar.pillarWidth + rockRadius + rockDistanceToPillar;
    let y = random(screenY * 0.2, screenY * 0.8);
    rocks.push(new Rock(x, y, rockRadius, objectSpeed, rockImg));
    currentPillarCount = 0;
  }
}

// =============================================================================
// CLASSES
// =============================================================================

class Player {
  constructor(posX, posY, radius, jumpKey, jump, playerScale) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius * playerScale;
    this.jumpKey = jumpKey.toLowerCase();
    this.jump = jump;
    this.playerScale = playerScale;
    this.velocityY = 0;
    this.gravity = 9.81;
    this.velRange = 10;
    this.angleRange = HALF_PI;
    
    this.isInvincible = false;
    this.invincibilityDuration = 3;
    this.invincibilityTimer = 0;
  }

  updatePlayer() {
    this.wallCollision();
    this.pillarCollision();
    this.applyGravity();
    this.checkInvincibility();
    this.movePlayer();
  }

  drawPlayer() {
    strokeWeight(1);
    push();
    translate(this.posX, this.posY);
    
    let angle = map(this.velocityY, -this.velRange, this.velRange, -this.angleRange, this.angleRange);
    rotate(constrain(angle, -this.angleRange, this.angleRange));
    
    if (debug) {
      fill(255, 255, 255, 100);
      ellipse(0, 0, this.radius, this.radius);
    }
    scale(this.playerScale);
    
    if (skin === Skins.BASIC) {
      let c1 = !this.isInvincible ? color(200, 200, 200) : color(219, 209, 10);
      let c2 = !this.isInvincible ? color(150, 150, 150) : color(163, 151, 20);
      let c3 = !this.isInvincible ? color(100, 100, 100) : color(138, 122, 15);
      
      fill(c1);
      triangle(-20, -15, 25, 0, -15, 0);
      fill(c2);
      triangle(-15, 0, 25, 0, -15, 20);
      fill(c3);
      triangle(-3, 0, 25, 0, 0, 15);
      fill(c1);
      triangle(-15, 0, 25, 0, -10, 12);
    }
    
    if (skin === Skins.NIGHTHAWK) {
      let b1 = !this.isInvincible ? color(100, 100, 100) : color(219, 209, 10);
      let b2 = !this.isInvincible ? color(60, 60, 60) : color(163, 151, 20);
      let b3 = !this.isInvincible ? color(50, 50, 50) : color(138, 122, 15);
      
      fill(b1);
      quad(-20, -15, -5, -11, -15, -20, -22, -22);
      triangle(-20, -15, 25, 0, -15, 0);
      fill(b2);
      triangle(-15, 0, 25, 0, -15, 20);
      fill(b3);
      quad(5, 0, 26, 0, 32, 9, 0, 0);
      triangle(-3, 0, 25, 0, 0, 15);
      fill(b1);
      triangle(-15, 0, 25, 0, -10, 12);
      quad(-15, 13, 0, 8, -10, 3, -19, 4);
    }
    
    pop(); 
    
    if (this.isInvincible) {
      let secondsLeft = ceil(this.invincibilityTimer - gameTime);
      fill(255, 255, 255);
      noStroke();
      textSize(25);
      textAlign(RIGHT, TOP);
      text("Invincible: " + secondsLeft + "s", screenX - 20, 25);
    }
  }
  
  applyGravity() {
    this.velocityY += this.gravity * 1.5 * deltaTimeSeconds;
  }
  
  movePlayer() {
    this.posY += this.velocityY;
  }
  
  captureInput() {
    if (key.toLowerCase() === this.jumpKey) {
      this.jumpPressed();
    }
  }
  
  jumpPressed() {
    this.velocityY = -this.jump;
  }
  
  wallCollision() {
     if (this.posY - this.radius / 2 < 0 || this.posY + this.radius > screenY) {
       gameState = GameState.GAME_OVER;
     }
  }
  
  pillarCollision() {
     if (this.isInvincible) return;
     
     if (this.posX + this.radius / 2 > pillar1.posX && this.posX - this.radius / 2 < pillar1.posX + pillar1.pillarWidth) {
       if (this.posY - this.radius / 2 < pillar1.pillarSizeY || this.posY + this.radius / 2 > pillar1.pillarSizeY + pillar1.gap) {
         gameState = GameState.GAME_OVER;
       }
     }
     if (this.posX + this.radius / 2 > pillar2.posX && this.posX - this.radius / 2 < pillar2.posX + pillar2.pillarWidth) {
       if (this.posY - this.radius / 2 < pillar2.pillarSizeY || this.posY + this.radius / 2 > pillar2.pillarSizeY + pillar2.gap) {
         gameState = GameState.GAME_OVER;
       }
     }
  }
  
  makeInvincible() {
    this.isInvincible = true;
    this.invincibilityTimer = gameTime + this.invincibilityDuration;
  }
  
  checkInvincibility() {
    if (!this.isInvincible) return;
    if (gameTime >= this.invincibilityTimer) {
      this.isInvincible = false;
    }
  }
  
  onGameRestart() {
    this.isInvincible = false;
    this.velocityY = 0;
    this.posY = screenY / 2;
  }
}

class Pillar {
  constructor(gap, posX, pillarWidth, pillarColor, minPillar, pillarSpeed) {
    this.gap = gap;
    this.posX = posX;
    this.pillarWidth = pillarWidth;
    this.pillarColor = pillarColor;
    this.minPillar = minPillar;
    this.pillarSizeY = random(this.minPillar, screenY - this.gap - this.minPillar);
    this.pillarSpeed = pillarSpeed;
    this.hasCountedScore = false;
  }
  
  updatePillar() {
    this.movePillar();
    this.checkRespawnPillar();
    this.checkScore();
  }
  
  checkRespawnPillar() {
     if (this.posX < -this.pillarWidth) {
       this.posX = screenX; 
       this.pillarSizeY = random(this.minPillar, screenY - this.gap - this.minPillar);
       this.hasCountedScore = false;
       onPillarRespawned(this);
     }
  }
  
  movePillar() {
    this.posX -= this.pillarSpeed * deltaTimeSeconds;
  }
  
  drawPillar() {
    if (debug) {
      fill(this.pillarColor);
      rect(this.posX, 0, this.pillarWidth, this.pillarSizeY);
      rect(this.posX, this.pillarSizeY + this.gap, this.pillarWidth, screenY);
    }
    
    let posYLowerScissorScrew = screenY - ((screenY - this.pillarSizeY - this.gap) * 0.1);
    let screwPosX = this.posX + this.pillarWidth / 2;
    let screwColor = color(200, 200, 200);
    let frontBladeColor = color(150, 150, 150);
    let backBladeColor = color(130, 130, 130);
    strokeWeight(1);
    stroke(0);
    
    fill(backBladeColor);
    quad(this.posX, 0, this.posX + this.pillarWidth, 0, this.posX + this.pillarWidth, this.pillarSizeY,  this.posX + this.pillarWidth - (this.pillarWidth / 5), this.pillarSizeY);
    fill(frontBladeColor);
    quad(this.posX, 0, this.posX + this.pillarWidth, 0, this.posX + this.pillarWidth / 5, this.pillarSizeY,  this.posX, this.pillarSizeY);
    fill(screwColor);
    ellipse(screwPosX, this.pillarSizeY * 0.1, 20, 20);
    line(screwPosX, this.pillarSizeY * 0.1 - 8, screwPosX, this.pillarSizeY * 0.1 + 8);
    
    fill(backBladeColor);
    quad(this.posX, screenY, this.posX + this.pillarWidth, screenY, this.posX + this.pillarWidth / 5, this.pillarSizeY + this.gap, this.posX, this.pillarSizeY + this.gap);
    fill(frontBladeColor);
    quad(this.posX, screenY, this.posX + this.pillarWidth, screenY, this.posX + this.pillarWidth, this.pillarSizeY + this.gap, this.posX + this.pillarWidth - (this.pillarWidth / 5), this.pillarSizeY + this.gap);
    fill(screwColor);
    ellipse(screwPosX, posYLowerScissorScrew, 25, 25);
    line(screwPosX, posYLowerScissorScrew - 8, screwPosX, posYLowerScissorScrew + 8);
  }
  
  checkScore() {
    if (!this.hasCountedScore && this.posX < player1.posX) {
      score++;
      this.hasCountedScore = true;
    }
  }
}

class Rock {
  constructor(posX, posY, radius, speed, imageAsset) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.speed = speed;
    this.rockImage = imageAsset;
    
    colorMode(HSB, 360, 100, 100);
    this.rockColor = color(random(10, 70), random(20, 80), random(20, 50));
    colorMode(RGB, 255, 255, 255);
  }
  
  update() {
    this.move();
    this.checkCollision();
    this.checkMapBoundaries();
  }
  
  drawRock() {
    if (debug) {
      fill(this.rockColor);
      circle(this.posX, this.posY, this.radius);
    }
    image(this.rockImage, this.posX - this.radius / 2, this.posY - this.radius / 2, this.radius, this.radius);
  }
  
  move() {
    this.posX -= this.speed * deltaTimeSeconds;
  }
  
  checkCollision() {
    let a = player1.posX - this.posX;
    let b = player1.posY - this.posY;
    let distance = sqrt(a * a + b * b);
    
    if (distance < (this.radius / 2) + (player1.radius / 2)) {
      player1.makeInvincible();
      this.destroy();
    }
  }
  
  checkMapBoundaries() {
    if (this.posX < -this.radius) this.destroy();
  }
  
  destroy() {
    let index = rocks.indexOf(this);
    if (index > -1) {
      rocks.splice(index, 1);
    }
  }
}

class ParallaxBackground {
  constructor(screenHeight, speed, imageAsset) {
    this.image = imageAsset;
    this.posX = 0;
    this.backgroundHeight = screenHeight;
    this.backgroundWidth = (this.image.width / this.image.height) * this.backgroundHeight;
    this.speed = speed;
  }

  update() {
    this.posX -= this.speed * deltaTimeSeconds;
    if (this.posX <= -this.backgroundWidth) {
      this.posX += this.backgroundWidth;
    }
  }

  drawBackground() {
    if (this.image.width <= 1) {
      background(10, 15, 30);
      return;
    }
    image(this.image, this.posX, 0, this.backgroundWidth, this.backgroundHeight);
    image(this.image, this.posX + this.backgroundWidth, 0, this.backgroundWidth, this.backgroundHeight);
  }
}