var pi = 3.141592;
var deg = pi / 180;
var collectedItemCount = 0;
var collectionSound = new Audio("collect.mp3");

function player(x, y, z, rx, ry) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.rx = rx;
  this.ry = ry;
}

var PressBack = 0;
var PressForward = 0;
var PressLeft = 0;
var PressRight = 0;
var PressUp = 0;
var MouseX = 0;
var MouseY = 0;

var lock = false;

var onGround = true;

var container = document.getElementById("container");

document.addEventListener("pointerlockchange", (event) => {
  lock = !lock;
});

container.onclick = function () {
  if (!lock) container.requestPointerLock();
};

document.addEventListener("keydown", (event) => {
  if (event.key == "a") {
    PressLeft = 7;
  }
  if (event.key == "w") {
    PressForward = 7;
  }
  if (event.key == "d") {
    PressRight = 7;
  }
  if (event.key == "s") {
    PressBack = 7;
  }
  if (event.keyCode == 32 && onGround) {
    PressUp = 50;
    onGround = false;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "a") {
    PressLeft = 0;
  }
  if (event.key == "w") {
    PressForward = 0;
  }
  if (event.key == "d") {
    PressRight = 0;
  }
  if (event.key == "s") {
    PressBack = 0;
  }
  if (event.keyCode == 32) {
    PressUp = 0;
    onGround = true;
  }
});

document.addEventListener("mousemove", (event) => {
  MouseX = event.movementX;
  MouseY = event.movementY;
});

var pawn = new player(0, 0, 0, 0, 0);

var world = document.getElementById("world");

function update() {
  let dx =
    (PressRight - PressLeft) * Math.cos(pawn.ry * deg) -
    (PressForward - PressBack) * Math.sin(pawn.ry * deg);
  let dz =
    -(PressForward - PressBack) * Math.cos(pawn.ry * deg) -
    (PressRight - PressLeft) * Math.sin(pawn.ry * deg);
  let dy = -PressUp;
  let drx = MouseY;
  let dry = -MouseX;

  MouseX = MouseY = 0;

  pawn.x = pawn.x + dx;
  if (pawn.y >= -1000) {
    pawn.y = pawn.y + dy;
  }

  pawn.z = pawn.z + dz;

  if (onGround) {
    if (pawn.y !== 0) {
      pawn.y = pawn.y + 1;
    }
  }

  if (lock) {
    pawn.rx = pawn.rx + drx;
    pawn.ry = pawn.ry + dry;
  }

  items.forEach((item, index) => {
    let dx = pawn.x - item[0];
    let dy = pawn.y - item[1];
    let dz = pawn.z - item[2];

    let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    document.getElementById("scoreBoard").innerText =
      "Collected Items: " + collectedItemCount + "/" + items.length;
    if (distance <= 8 * item[6]) {
      collectItem(index);
    }
  });

  world.style.transform =
    "translateZ(" +
    (600 - 0) +
    "px)" +
    "rotateX(" +
    -pawn.rx +
    "deg)" +
    "rotateY(" +
    -pawn.ry +
    "deg)" +
    "translate3d(" +
    -pawn.x +
    "px," +
    -pawn.y +
    "px," +
    -pawn.z +
    "px)";
}

function collectItem(index) {
  let itemElement = document.getElementById("item" + index);
  if (itemElement) {
    itemElement.parentNode.removeChild(itemElement);
    collectionSound
      .play()
      .catch((error) => console.error("Sound playback failed", error));

    collectedItemCount++;
  }
}

CreateNewWorld(map);
createItems();
TimerGame = setInterval(update, 10);
