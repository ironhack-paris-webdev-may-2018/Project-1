// Definitions
// -----------

function Food (myImage, myWidth, myHeight) {
  this.image = myImage;
  this.width = myWidth;
  this.height = myHeight;
  this.isGood = true;
  this.isEaten = false;

  // initially off screen
  this.x = myCanvas.width;
  // random initial Y
  this.y = Math.floor(Math.random() * myCanvas.height) + 1;
  // random speed (1-10)
  this.speed = Math.floor(Math.random() * 10) + 1;
}

Food.prototype.draw = function () {
  this.x -= this.speed;
  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
};

function boxCollision (x1, y1, width1, height1, x2, y2, width2, height2) {
  return x1 < x2 + width2 &&
    x1 + width1 > x2 &&
    y1 < y2 + height2 &&
    height1 + y1 > y2;
}


// -----------------------------------------------------------------------------
// Canvas
// ------

var myCanvas = document.querySelector("canvas");

// make the canvas take up the entire screen
myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

window.onresize = function () {
  // when the window is resized, resize the canvas
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
};

var ctx = myCanvas.getContext("2d");

// Load images
var playerImg = new Image();
playerImg.src = "./images/person.png";

var beerImg = new Image();
beerImg.src = "./images/beer.png";

var pizzaImg = new Image();
pizzaImg.src = "./images/pizza.png";

var broccoliImg = new Image();
broccoliImg.src = "./images/broccoli.png";

var eggplantImg = new Image();
eggplantImg.src = "./images/eggplant.png";

var y = 50;

var foodImages = [beerImg, pizzaImg, broccoliImg, eggplantImg];
var movingFoods = [
  new Food(beerImg, 60, 60)
];


// Add more foods over time
var addFood = setInterval(function () {
  var randomIndex = Math.floor(Math.random() * foodImages.length);
  var image = foodImages[randomIndex];

  var height = 60;
  if (image === pizzaImg) {
    height = 40;
  }

  var newFood = new Food(image, 60, height);
  if (image === broccoliImg || image === eggplantImg) {
    newFood.isGood = false;
  }
  movingFoods.push(newFood);
}, 600);


var drawLoop = setInterval(function () {
  // erase the old drawings
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  // redraw everything
  ctx.drawImage(playerImg, 50, y, 57, 88);

  movingFoods.forEach(function (oneFood) {
    // check collision with player
    var isCollision = boxCollision(50, y, 57, 88, oneFood.x, oneFood.y, oneFood.width, oneFood.height);
    if (isCollision) {
      // continue if it's a good food
      if (oneFood.isGood) {
        oneFood.isEaten = true;
      }
      else {
        // GAME OVER if it's a bad food
        // (stop the loops to freeze the game)
        clearInterval(drawLoop);
        clearInterval(addFood);
      }
    }
    oneFood.draw();
  });

  // remove eaten foods from the array
  movingFoods = movingFoods.filter(function (oneFood) {
    return !oneFood.isEaten;
  });
}, 1000 / 60);
  // redraw 60 times a second for smooth animations


// -----------------------------------------------------------------------------
// User inputs
// -----------

var body = document.querySelector("body");
body.onkeydown = function (event) {
  switch (event.keyCode) {
    case 32: // space bar
    case 87: // W key (90 for French keyboards)
    case 38: // up arrow
      y -= 5;
      event.preventDefault();
      break;

    case 83: // S key
    case 40: // down arrow
      y += 5;
      event.preventDefault();
      break;
  }
};
