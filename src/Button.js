import { MAX_BULLETS, STATES } from "/src/game";

export default class Button {
  constructor(game) {
    this.game = game;
    this.ratio = 100;
    this.width = this.ratio;
    this.height = this.ratio;
    this.speed = { x: 0, y: 0 };
    this.moveRatio = { x: 0, y: 0 };
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight / 2 - this.height / 2
    };
    this.reloadSound = new Audio("src/audio/reload2.mp3");
    this.reloadSound.preload = "auto";
    this.radius = this.ratio / 2;
    this.centerPosition = {
      x: this.position.x + this.radius,
      y: this.position.y + this.radius
    };
    this.beingMoved = false;
    this.imgs = {
      menu: this.createGameButton("/src/img/menuButton.png"),
      reload: this.createGameButton("/src/img/reloadButton.png"),
      go: this.createGameButton("/src/img/goButton.png")
    };
  }

  isClicked() {
    if (this.game.detectMouseCollision(this)) {
      switch (this.game.state) {
        case STATES.RUNNING:
          if (!this.beingMoved) {
            this.game.bullets = MAX_BULLETS;
            this.reloadSound.currentTime = 0;
            this.reloadSound.play();
          }
          break;
        case STATES.GAMEOVER:
          this.game.state = STATES.MENU;
          break;
        case STATES.MENU:
          this.game.restart();
          break;
        case 4:
          break;
        default:
      }
    }
  }

  createGameButton(path) {
    var button = new Image(this.width, this.height);
    button.src = path;
    return button;
  }
  update() {
    if (this.beingMoved) {
    }
  }

  draw(ctx) {
    switch (this.game.state) {
      case 1:
        if (this.game.bullets !== 0) {
          ctx.drawImage(
            this.imgs.reload,
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        } else {
          ctx.drawImage(
            this.imgs.reload,
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        }
        break;
      case 2:
        ctx.drawImage(
          this.imgs.menu,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
        break;
      case 3:
        ctx.drawImage(
          this.imgs.go,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
        break;
      case 4:
        break;
      default:
    }
  }
}
