(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _genesis = require("./js/genesis.js");

console.log("NICE");
console.log("Try to create rabbit element -> Now ->");
/**
 * Vanilla js
 */
// Mora van {} ako zelimo global access kroz console

var objekat = null;

window.onload = function () {
  // objekat je instanca klase myElement
  var options = {
    // name: 'MojElement', // uniq
    content: "ja sam dugme",
    position: {
      x: 45,
      y: 25
    },
    bgColor: 'black',
    color: 'lime',
    border: 'solid lime 1px',
    dimension: {
      width: 15,
      height: 15
    }
  };

  var testClick = function () {
    alert("COOL MAN");
  };

  objekat = new _genesis.rabbitElement(options, testClick);
  /*
  var elementsInBox = [];
  var r = 0, g = 0 , b = 0;
  for (var j = 0; j < 10 ; j++) {
    for (var i = 0; i < 10 ; i++) {
      r = i * 5
      g = i + j * 5
      b = i + i * 5 + j * 5
      var optionsBox = {
        name: "id" + j,
        content: "VOODOO PEOPLE",
        position: { x: j * 9.989, y : i * 9.97},
        dimension: { width: 10 , height: 10 },
        bgColor: "rgb(" + r + " , " + g * 2 + " , " + b + " )",
        border: 'solid lime 1px',
      };
      elementsInBox.push(new myElement(optionsBox));
    }
  }
  */

  /** Kad prebacis nesto na `this.`
   *  onda je to postao property te klase i lako mozes pristupiti
   *  na sledeci nacin.
   */
  // console.log("Access objekt => ", objekat.dom.innerHTML)

  /**
   * I na kraju manipulacija
   */

  setTimeout(function () {
    objekat.position.translateByX(50);
    objekat.position.translateByY(50);
  }, 2000);
};

},{"./js/genesis.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rabbitElement = rabbitElement;

var _math = require("./math.js");

var registerAutoUpdate = [];

function myEngine() {
  registerAutoUpdate.forEach(function (item) {
    item.position.update();
    item.update();
  });
  setTimeout(function () {
    myEngine();
  }, 20);
} // run


myEngine();
/**
 * Child class or subClass
 * @name Position
 * @param currentX number
 * @param currentY number
 */

function Position(curentX, curentY) {
  /**
   * Local var only in this { space }
   * but global for inside of Position
   */
  var root = this;
  /**
   * Kontrolni flag
   * zamrznuti sve
   */

  this.FREEZ = false;
  /**
   * Ova funkcija je prazna ona je namenjena
   * za override ...
   */

  this.onTargetReached = function () {
    console.log("%c" + "Object reached target position.", "background: #333; color: lime");
  }; // Parameters
  // Parametri neophodni za matematicku operaciju `translacija`


  this.x = curentX;
  this.y = curentY;
  this.targetX = curentX;
  this.targetY = curentY;
  this.velX = 0;
  this.velY = 0;
  this.thrust = 1; // Za sada samo fiktivno

  this.type = "NORMAL"; // Flag koji kazuje dali smo u pokretu ili ne

  this.IN_MOVE = true; // namesti brzinu kretanja

  this.setSpeed = function (num_) {
    if (typeof num_ === "number") {
      this.thrust = num_;
    } else {
      console.warn("App: warning for method 'setSpeed'  Desciption : argument (num_) must be type of number.");
    }
  };

  this.translateByX = function (x_) {
    console.log("%c" + "Test translateByX !", "background: #333; color: lime");
    this.IN_MOVE = true;
    this.targetX = x_;
  };

  this.translateByY = function (y_) {
    this.IN_MOVE = true;
    this.targetY = y_;
  };

  this.translate = function (x_, y_) {
    this.IN_MOVE = true;
    this.targetX = x_;
    this.targetY = y_;
  };

  this.setPosition = function (x_, y_) {
    if (this.type == "NORMAL") {
      this.targetX = x_;
      this.targetY = y_;
      this.x = x_;
      this.y = y_;
      this.IN_MOVE = false;
    }
  };
  /**
   * TEk nakon pozivanja update
   * dobicemo nove pozicije x i y
   */


  this.update = function () {
    var tx = this.targetX - this.x,
        ty = this.targetY - this.y,
        dist = Math.sqrt(tx * tx + ty * ty),
        rad = Math.atan2(ty, tx),
        angle = rad / Math.PI * 180;
    this.velX = tx / dist * this.thrust;
    this.velY = ty / dist * this.thrust;

    if (this.IN_MOVE == true) {
      if (dist > this.thrust) {
        this.x += this.velX;
        this.y += this.velY;
      } else {
        this.x = this.targetX;
        this.y = this.targetY;
        this.IN_MOVE = false;
        root.onTargetReached();
      }
    }
  };

  this.getX = function () {
    return window.innerWidth / 100 * this.x;
  };

  this.getY = function () {
    return window.innerHeight / 100 * this.y;
  };

  this.getXPixel = function () {
    return window.innerWidth / 100 * this.x + "px";
  };

  this.getYPixel = function () {
    return window.innerHeight / 100 * this.y + "px";
  };
}

function Dimensions(w, h) {
  // NAPISI PROVERU TIPA
  // ZA SLUCASJ DA w i h nisu definisani
  this.w = w;
  this.h = h;

  this.getWidth = function () {
    return window.innerWidth / 100 * this.w;
  };

  this.getHeight = function () {
    return window.innerHeight / 100 * this.h;
  };

  this.getWidthPixel = function () {
    return window.innerWidth / 100 * this.w + "px";
  };

  this.getHeightPixel = function () {
    return window.innerHeight / 100 * this.h + "px";
  };
}
/**
 * @description
 * Main class
 */


function rabbitElement(options, onClick) {
  if (typeof options === "undefined") {
    // --------------------------------------------------------------------------------
    // options nije definisan. Definisemo ga sa defoltnim vrednostima.
    // --------------------------------------------------------------------------------
    options = {
      content: "EMPTY",
      position: new Position(45, 45),
      dimension: new Dimensions(5, 5),
      type: "absolute",
      textAlign: "center",
      color: "white",
      bgColor: "black",
      border: "solid red 1px"
    };
    console.info("Default options value loaded.");
  } else {
    // --------------------------------------------------------------------------------
    // options kao arg je definisan ali i dalje nismo sigurni sta je sve u njemu definisano
    // --------------------------------------------------------------------------------
    if (typeof options.content === "undefined") {
      options.content = "EMPTY";
    }

    if (typeof options.position === "undefined") {
      options.position = new Position(45, 45);
    }

    if (typeof options.dimension === "undefined") {
      options.dimension = new Dimensions(5, 5);
    }

    if (typeof options.type === "undefined") {
      options.type = "absolute";
    }

    if (typeof options.textAlign === "undefined") {
      options.textAlign = "center";
    }

    if (typeof options.color === "undefined") {
      options.color = "white";
    }

    if (typeof options.bgColor === "undefined") {
      options.bgColor = "black";
    }

    if (typeof options.border === "undefined") {
      options.border = "solid red 1px";
    }

    if (typeof options.name === "undefined") {
      options.name = "randomname" + (0, _math.randomIntFromInterval)(1, 100000) + +"_" + (0, _math.randomIntFromInterval)(1, 100000);
    }
  } // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------


  this.type = options.type;
  this.position = new Position(options.position.x, options.position.y);
  this.dimension = new Dimensions(options.dimension.width, options.dimension.height);
  registerAutoUpdate.push(this); // DOM ELEMENT

  this.dom = document.createElement("div");
  this.dom.setAttribute("id", options.name);
  this.name = options.name;
  this.dom.style.position = this.type;
  this.dom.style.textAlign = options.textAlign;
  this.dom.style.display = "block";
  this.dom.style.width = this.dimension.getWidthPixel();
  this.dom.style.height = this.dimension.getHeightPixel(); // SOLORS AND THERE HERE

  this.dom.style.color = options.color;
  this.dom.style.background = options.bgColor;
  this.dom.style.border = options.border; // CONTENT STAFF

  this.dom.innerHTML = options.content;

  if (typeof onClick !== "undefined") {
    this.dom.addEventListener("click", onClick, false);
    console.info("Click event added.");
  }

  document.body.appendChild(this.dom); // auto update

  this.update = function () {
    this.dom.style.left = this.position.getXPixel();
    this.dom.style.top = this.position.getYPixel();
  };

  console.info("Rabbit Element " + this.name + " added.");
}

},{"./math.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomIntFromInterval = randomIntFromInterval;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

},{}]},{},[1]);
