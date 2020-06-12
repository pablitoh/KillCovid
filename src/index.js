import Game from "/src/game";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let canvas = document.getElementById("gameScreen");
canvas.setAttribute("width", GAME_WIDTH);
canvas.setAttribute("height", GAME_HEIGHT);
let ctx = canvas.getContext("2d");
//canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
window.addEventListener("resize", resize, false);
window.addEventListener("orientationchange", resize, false);
resize();

let lastTime = 0;
let game = new Game(window.innerWidth, window.innerHeight);
game.start();
var dtsum = 0;
requestAnimationFrame(gLoop);
function gLoop(timeStamp) {
  game.gameWidth = canvas.width;
  game.gameheight = canvas.height;
  let dt = timeStamp - lastTime;
  lastTime = timeStamp;
  dtsum += dt;
  if (dtsum > 15) {
    game.update(dt);
    dtsum = 0;
  }
  game.draw(ctx);
  requestAnimationFrame(gLoop);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
