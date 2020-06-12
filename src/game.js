import Button from "/src/Button";
import Target from "/src/target";
import MouseHandler from "/src/MouseHandler";
import Hud from "./hud";
import GameArea from "./GameArea";

export const STATES = {
  PAUSED: 0,
  RUNNING: 1,
  GAMEOVER: 2,
  MENU: 3
};
const TIME = 20000; // Ms
export const MAX_BULLETS = 5;
export const MAX_TARGETS = 5;

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.mouseHandler = new MouseHandler(this);
    this.targets = this.createTargets(this);
    this.button = new Button(this);
    this.scoreboard = new Hud(this);
    this.gameArea = new GameArea(this);
    this.bullets = MAX_BULLETS;
    this.score = 0;
    this.state = STATES.MENU;
    this.gameObjects = [this.button, this.gameArea, ...this.targets];
    this.timer = TIME;
    this.startTime = new Date();
  }

  start() {
    this.state = STATES.MENU;
  }

  update(dt) {
    if (this.state === STATES.RUNNING) {
      this.currentTime = new Date();
      this.elapsedTime = this.currentTime - this.startTime; // ms
      this.timer -= this.elapsedTime;
      this.startTime = this.currentTime;
      if (this.timer <= 0) {
        this.state = STATES.GAMEOVER;
      }
      this.gameObjects.forEach(object => {
        object.update(dt);
      });

      if (this.areTargetsAlive().length === 0) {
        this.reshuffle();
      }
    }
  }

  draw(ctx) {
    switch (this.state) {
      case STATES.MENU:
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        ctx.font = "30px serif ";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Project: KillCovid", this.gameWidth / 2, 50);
        ctx.font = "20px serif ";
        ctx.fillText("dev by @pabconde", this.gameWidth / 2, 100);
        this.button.draw(ctx);
        break;
      case STATES.RUNNING:
        this.gameArea.drawBg(ctx);
        this.targets.forEach(target => {
          target.draw(ctx);
        });
        if (this.bullets === 0) {
          ctx.fillStyle = "rgba(255,0,0,0.2";
          ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
          ctx.font = "30px serif ";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText(
            "RELOAD",
            this.button.centerPosition.x,
            this.button.centerPosition.y - (this.button.radius + 100)
          );
        }
        //ctx.fillStyle = "rgba(39,159,0,0.5)";
        //ctx.fillRect(this.gameWidth / 2, 0, 5, this.gameHeight);
        //ctx.fillRect(0, this.gameHeight / 2, this.gameWidth, 5);
        this.scoreboard.draw(ctx);
        this.button.draw(ctx);
        break;
      case STATES.GAMEOVER:
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        if (this.state === STATES.GAMEOVER) {
          ctx.textAlign = "center";
          ctx.fillStyle = "#400";
          ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
          ctx.font = "30px serif ";
          ctx.fillStyle = "white";
          ctx.fillText(
            "GAME OVER\r\nScore: " + this.score + "!!",
            this.gameWidth / 2,
            50
          );
          this.button.draw(ctx);
        }
        break;
      default:
        break;
    }
  }
  getDistance(obj1, obj2) {
    var distX =
      obj2.centerPosition.x +
      obj2.moveRatio.x -
      obj1.centerPosition.x +
      obj1.moveRatio.x;
    var distY =
      obj2.centerPosition.y +
      obj2.moveRatio.y -
      obj1.centerPosition.y +
      obj1.moveRatio.y;

    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
  }

  getDistanceFromPointer(obj) {
    let distX = obj.centerPosition.x - this.mouseHandler.position.x;
    let distY = obj.centerPosition.y - this.mouseHandler.position.y;
    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
  }

  detectObjectCollision(obj1, obj2) {
    if (this.getDistance(obj1, obj2) <= obj1.radius + obj2.radius) {
      return true;
    } else {
      return false;
    }
  }

  detectMouseCollision(obj) {
    if (this.getDistanceFromPointer(obj) <= obj.radius) {
      return true;
    } else {
      return false;
    }
  }

  reshuffle() {
    this.targets.forEach(obj => {
      if (obj.isDead) {
        obj.reset();
      }
    });
  }
  restart() {
    this.restartTimer();
    this.bullets = MAX_BULLETS;
    this.score = 0;
    this.targets = [];
    this.targets = this.createTargets(MAX_TARGETS, this);
    this.gameObjects = [this.button, this.gameArea, ...this.targets];
    this.state = STATES.RUNNING;
  }
  createTargets(number, game) {
    var targets = [];
    for (var i = 0; i < number; i++) {
      targets.push(this.getValidTarget(game, targets));
    }
    return targets;
  }
  getValidTarget(game, targets) {
    var posibleTarget;
    posibleTarget = new Target(game);
    targets.forEach(target => {
      while (
        game.detectObjectCollision(posibleTarget, target) ||
        game.detectObjectCollision(posibleTarget, game.button) ||
        posibleTarget.position.x <= 0 ||
        posibleTarget.position.x + posibleTarget.width >= this.gameWidth ||
        posibleTarget.position.y <= 0 ||
        posibleTarget.position.y + posibleTarget.width >= game.gameHeightg
      ) {
        posibleTarget = new Target(game);
      }
    });
    return posibleTarget;
  }
  restartTimer() {
    this.startTime = new Date();
    this.timer = TIME;
  }

  areTargetsAlive() {
    return this.targets.filter(target => !target.isDead);
  }
}
