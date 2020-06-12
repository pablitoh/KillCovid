import { STATES } from "/src/game";

export default class Target {
  constructor(game) {
    this.game = game;
    this.ratio = this.getRatio();
    this.width = this.ratio;
    this.height = this.ratio;
    this.radius = this.ratio / 2;
    this.isDead = false;
    this.moveRatio = { x: 0, y: 0 };
    this.img = new Image(this.width, this.height);
    this.img.src = "/src/img/cutecovidsmall.png";
    this.decisionInterval = this.getdecisionInterval();
    this.speed = this.getSpeed();
    this.position = { x: 0, y: 0 };
    this.centerPosition = { x: 0, y: 0 };
    this.direction = this.getPosibleDirection();
    this.getPosiblePosition();
    this.decisionTimer = 0;
  }

  update(dt) {
    var factor = 1;
    if (this.game.state === STATES.RUNNING && !this.isDead) {
      this.decisionTimer += dt;

      this.moveRatio = {
        x: (this.speed.x * this.direction.x) / dt,
        y: (this.speed.y * this.direction.y) / dt
      };

      if (this.game.detectObjectCollision(this, this.game.button)) {
        this.direction.y = -this.direction.y;
        this.direction.x = -this.direction.x;
        this.decisionTimer = 0;

        while (this.game.detectObjectCollision(this, this.game.button)) {
          this.moveRatio = {
            x: (this.speed.x * this.direction.x) / dt,
            y: (this.speed.y * this.direction.y) / dt
          };
          this.position.x += this.moveRatio.x;
          this.position.y += this.moveRatio.y;
          factor++;
          this.centerPosition = this.getCenter(this.position);
        }

        //this.updateDirection(dt);
      }
      if (
        this.position.x + this.width + this.moveRatio.x >=
          this.game.gameWidth ||
        this.position.x + this.moveRatio.x <= 0
      ) {
        this.position.x -= this.moveRatio.x * factor;
        this.direction.x = -this.direction.x;
        this.decisionTimer = 0;
      }
      if (
        this.position.y + this.height + this.moveRatio.y >=
          this.game.gameHeight ||
        this.position.y + this.moveRatio.y <= 0
      ) {
        this.position.y -= this.moveRatio.y * factor;
        this.direction.y = -this.direction.y;
        this.decisionTimer = 0;
      }

      this.game.targets.forEach(target => {
        if (target !== this && this.game.detectObjectCollision(target, this)) {
          this.direction = { x: -this.direction.x, y: -this.direction.y };
          target.direction = {
            x: -target.direction.x,
            y: -target.direction.y
          };
          this.decisionTimer = 0;
        }
      });

      //Con otros targets
      //Decision maker
      if (this.decisionTimer >= this.decisionInterval) {
        this.direction = this.getPosibleDirection();
        this.speed = this.getSpeed();
        this.decisionTimer = 0;
      }

      this.moveRatio = {
        x: (this.speed.x * this.direction.x) / dt,
        y: (this.speed.y * this.direction.y) / dt
      };
      this.position.x += this.moveRatio.x;
      this.position.y += this.moveRatio.y;
      //this.updateDirection(dt);
      this.centerPosition = this.getCenter(this.position);
    }
  }

  getCenter(position) {
    return {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };
  }
  draw(ctx) {
    if (!this.isDead) {
      ctx.globalAlpha = 0.8;
      ctx.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

      ctx.globalAlpha = 1;
    }
  }
  isClicked() {
    if (
      this.game.detectMouseCollision(this) &&
      this.game.bullets > 0 &&
      this.game.state === STATES.RUNNING
    ) {
      this.isDead = true;
      this.game.score++;
    }
  }

  getRatio() {
    return Math.floor(Math.random() * 50) + 60;
  }

  reset() {
    this.ratio = this.getRatio();
    this.width = this.ratio;
    this.height = this.ratio;
    this.isDead = false;
    this.getPosiblePosition();
    this.direction = this.getPosibleDirection();
    this.speed = this.getSpeed();
    this.radius = this.ratio / 2;
    this.centerPosition = this.getCenter();
    this.moveRatio = { x: 0, y: 0 };
  }
  getPosiblePosition() {
    this.position.x = Math.floor(
      Math.random() * (this.game.gameWidth - this.width)
    );
    this.position.y = Math.floor(
      Math.random() * (this.game.gameHeight - this.height)
    );
    this.centerPosition = this.getCenter();
  }

  getdecisionInterval() {
    return Math.floor(Math.random() * 500) + 300;
  }
  getPosibleDirection() {
    return {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1
    };
  }

  getSpeed() {
    return {
      x: Math.floor(Math.random() * 50) + 30,
      y: Math.floor(Math.random() * 50) + 30
    };
  }
}
