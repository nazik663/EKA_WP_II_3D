var pi = 3.141592;
var deg = pi / 180;

function player(x, y, z, rx, ry) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.rx = rx;
  this.ry = ry;
}

const size = 100,
  xPosition = -100,
  yPosition = -100,
  zPosition = -500; // Center position of the cube

var map = [
		   [0,0,1000,0,180,0,2000,600,"url('textures/1.jpg')", "ff0000"],
		   [0,0,-1000,0,0,0,2000,600,"url('textures/1.jpg')", "ff0000"],
		   [1000,0,0,0,-90,0,2000,600,"url('textures/1.jpg')", "ff0000"],
		   [-1000,0,0,0,90,0,2000,600,"url('textures/1.jpg')", "ff0000"],
		   [0,100,0,90,0,0,2000,2000,"url('textures/2.jpg')", "00ff00"],
  // Top Face
  [xPosition, yPosition - 50, zPosition, 90, 0, 0, size, size, "", "#FF0000"],
  // Bottom Face
  [xPosition, yPosition + 50, zPosition, -90, 0, 0, size, size, "", "#00FF00"],
  // Front Face
  [xPosition, yPosition, zPosition - 50, 0, 0, 0, size, size, "", "#0000FF"],
  // Back Face
  [xPosition, yPosition, zPosition + 50, 0, 180, 0, size, size, "", "#FFFF00"],
  // Right Face
  [xPosition + 50, yPosition, zPosition, 0, 90, 0, size, size, "", "#00FFFF"],
  // Left Face
  [xPosition - 50, yPosition, zPosition, 0, -90, 0, size, size, "", "#FF00FF"],
];

var treasurepos = [
  [850,0,200],
  [-400,0,-600],
  [100,0,-800],
  [-750,0,100],
  [-300,0,300],
  [80,0,-350],
  [380,0,-100],
  [-100,0,850],
  [-550,0,320],
  [300,0,-300],
  [801, 0, -928],
  [-898, 0, -170],
  [-741, 0, -899],
  [20, 0, 603],
  [-366, 0, -604],
  [418, 0, -997],
  [-12, 0, 723],
  [-151, 0, -100],
  [678, 0, -469],
  [-22, 0, 708],
  [-558, 0, 852],
  [-103, 0, 846],
  [-196, 0, 398],
  [728, 0, 644],
  [946, 0, 843],
  [-798, 0, 913],
  [-438, 0, -647],
  [-977, 0, -377],
  [641, 0, -396],
  [956, 0, 520]
];

var treasure = [
// [width,height,image]
[182,86,"url('textures/1.png')"],
[200,50,"url('textures/2.png')"],
[192,79,"url('textures/3.png')"],
[175,109,"url('textures/4.png')"],
[193,95,"url('textures/5.png')"]
];

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
    PressUp = 1;
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
  pawn.y = pawn.y + dy;
  pawn.z = pawn.z + dz;

  if (lock) {
    pawn.rx = pawn.rx + drx;
    pawn.ry = pawn.ry + dry;
  }

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

function CreateNewWorld(){
  CreateCoins()
	for (let i = 0; i < map.length; i++){
		
		let newElement = document.createElement("div");
		newElement.className = "square";
		newElement.id = "square" + i;
		newElement.style.width = map[i][6] + "px";
		newElement.style.height = map[i][7] + "px";
		
		if (!map[i][8] == null) {
			newElement.style.background = map[i][9];
		} else {
			newElement.style.backgroundImage = map[i][8];
		}

		newElement.style.transform = "translate3d(" +
		(600 - map[i][6]/2 + map[i][0]) + "px," +
		(400 - map[i][7]/2 + map[i][1]) + "px," +
		                    (map[i][2]) + "px)" +
		"rotateX(" + map[i][3] + "deg)" +
		"rotateY(" + map[i][4] + "deg)" +
		"rotateZ(" + map[i][5] + "deg)";

    

		world.append(newElement);
	}
}

function CreateCoins() {
  shuffle(treasurepos)
  for (let i = 0; i < treasure.length; i++){
		
		let newElement = document.createElement("div");
		newElement.className = "coin";
		newElement.id = "coin" + i;
		newElement.style.width = treasure[i][0] + "px";
		newElement.style.height = treasure[i][1] + "px";
    newElement.style.backgroundImage = treasure[i][2];
		world.append(newElement);

    newElement.style.transform = "translate3d(" +
		(600 - treasure[i][0]/2 + treasurepos[i][0]) + "px," +
		(400 - treasure[i][1]/2 + treasurepos[i][1]) + "px," +
		                    (treasurepos[i][2]) + "px)";
	}
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    [array[i], array[j]] = [array[j], array[i]]; // обмен элементов местами
  }
}

CreateNewWorld();
TimerGame = setInterval(update, 10);
