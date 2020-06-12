export default class Hud {
  constructor(game) {
    this.game = game;
  }

  draw(ctx) {
    ctx.font = "20px serif ";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + this.game.score, 5, 50);
    ctx.fillText("Time: " + Math.round(this.game.timer / 1000), 5, 100);
    ctx.fillText("Bullets: " + this.game.bullets, 5, 150);
  }
  update() {}
}
