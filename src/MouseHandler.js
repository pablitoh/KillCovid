export default class MouseHandler {
  constructor(game) {
    this.position = { x: 0, y: 0 };
    this.game = game;
    this.width = 0;
    this.height = 0;
    this.canvas = document.getElementById("gameScreen");
    this.touchX = 0;
    this.touchY = 0;

    this.canvas.addEventListener("mousedown", event => {
      var rect = this.canvas.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
      this.position = { x: this.mouseX, y: this.mouseY };

      game.gameObjects.forEach(object => {
        object.isClicked();
      });
    });
    this.canvas.addEventListener("touchstart", event => {
      event.preventDefault();

      if (event.touches.length === 1) {
        var touch = event.touches[0];
        this.touchX = touch.pageX - touch.target.offsetLeft;
        this.touchY = touch.pageY - touch.target.offsetTop;
        this.position = { x: this.touchX, y: this.touchY };
      }
      game.gameObjects.forEach(object => {
        object.isClicked();
      });
    });

    this.canvas.addEventListener("touchmove", event => {
      event.preventDefault();

      if (event.touches.length === 1) {
        var touch = event.touches[0];
        var touchMoveX = touch.pageX - touch.target.offsetLeft;
        var touchMoveY = touch.pageY - touch.target.offsetTop;

        if (this.game.detectMouseCollision(this.game.button)) {
          this.position = { x: touchMoveX, y: touchMoveY };
          //this.game.button.beingMoved = true;
          var touchOffsetX = touchMoveX - this.touchX;
          var touchOffsetY = touchMoveY - this.touchY;

          this.game.button.position = {
            x: this.game.button.position.x + touchOffsetX,
            y: this.game.button.position.y + touchOffsetY
          };

          this.game.button.centerPosition = {
            x: this.game.button.position.x + this.game.button.radius,
            y: this.game.button.position.y + this.game.button.radius
          };
          this.position = { x: touchMoveX, y: touchMoveY };
          this.touchX = touchMoveX;
          this.touchY = touchMoveY;
        }
      }
    });
    this.canvas.addEventListener("touchend", event => {
      event.preventDefault();
      console.log("end");
    });
  }
}
