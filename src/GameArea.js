import { STATES } from "/src/game";

export default class GameArea {
  constructor(game) {
    this.shotSound = [
      new Audio("src/audio/pop.mp3"),
      new Audio("src/audio/pop2.mp3")
    ];
    this.shotSound.preload = "auto";
    this.game = game;
    this.position = { x: 0, y: 0 };
    this.width = 800;
    this.height = 600;
    this.bg = new Image(this.gameWidth, this.gameHeight);
    if (this.game.gameWidth <= this.game.gameHeight)
      this.bg.src = "/src/img/bloodBgVertical.jpg";
    else this.bg.src = "/src/img/bloodBg.jpg";
  }

  update() {}

  draw(ctx) {}

  drawBg(ctx) {
    ctx.globalAlpha = 0.3;
    ctx.drawImage(this.bg, 0, 0, this.game.gameWidth, this.game.gameHeight);
    ctx.globalAlpha = 1;
  }
  isClicked() {
    if (this.game.bullets > 0 && this.game.state === STATES.RUNNING) {
      if (!this.game.detectMouseCollision(this.game.button)) {
        this.shotSound.currentTime = 0;
        this.shotSound[
          Math.floor(Math.random() * this.shotSound.length)
        ].play();
        this.game.bullets--;
      }
    }
  }
}
