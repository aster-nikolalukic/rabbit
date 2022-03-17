
import { randomIntFromInterval } from './math.js';

var registerAutoUpdate = [];

function myEngine() {
  registerAutoUpdate.forEach(function (item) {
    item.position.update();
    item.update();
  });

  setTimeout(function () {
    myEngine();
  }, 20);
}

// run
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
    console.log(
      "%c" + "Object reached target position.",
      "background: #333; color: lime"
    );
  };

  // Parameters
  // Parametri neophodni za matematicku operaciju `translacija`
  this.x = curentX;
  this.y = curentY;
  this.targetX = curentX;
  this.targetY = curentY;
  this.velX = 0;
  this.velY = 0;
  this.thrust = 1;

  // Za sada samo fiktivno
  this.type = "NORMAL";

  // Flag koji kazuje dali smo u pokretu ili ne
  this.IN_MOVE = true;

  // namesti brzinu kretanja
  this.setSpeed = function (num_) {
    if (typeof num_ === "number") {
      this.thrust = num_;
    } else {
      console.warn(
        "App: warning for method 'setSpeed'  Desciption : argument (num_) must be type of number."
      );
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
      angle = (rad / Math.PI) * 180;
    this.velX = (tx / dist) * this.thrust;
    this.velY = (ty / dist) * this.thrust;

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
    return (window.innerWidth / 100) * this.x;
  };

  this.getY = function () {
    return (window.innerHeight / 100) * this.y;
  };

  this.getXPixel = function () {
    return (window.innerWidth / 100) * this.x + "px";
  };

  this.getYPixel = function () {
    return (window.innerHeight / 100) * this.y + "px";
  };
}

function Dimensions(w, h) {
  // NAPISI PROVERU TIPA
  // ZA SLUCASJ DA w i h nisu definisani
  this.w = w;
  this.h = h;

  this.getWidth = function () {
    return (window.innerWidth / 100) * this.w;
  };

  this.getHeight = function () {
    return (window.innerHeight / 100) * this.h;
  };

  this.getWidthPixel = function () {
    return (window.innerWidth / 100) * this.w + "px";
  };

  this.getHeightPixel = function () {
    return (window.innerHeight / 100) * this.h + "px";
  };
}

/**
 * @description
 * Main class
 */
export function rabbitElement(options, onClick) {
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
      border: "solid red 1px",
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
      options.name =
        "randomname" +
        randomIntFromInterval(1, 100000) +
        +"_" +
        randomIntFromInterval(1, 100000);
    }
  }

  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------

  this.type = options.type;
  this.position = new Position(options.position.x, options.position.y);
  this.dimension = new Dimensions(
    options.dimension.width,
    options.dimension.height
  );
  registerAutoUpdate.push(this);

  // DOM ELEMENT
  this.dom = document.createElement("div");
  this.dom.setAttribute("id", options.name);
  this.name = options.name;
  this.dom.style.position = this.type;
  this.dom.style.textAlign = options.textAlign;
  this.dom.style.display = "block";
  this.dom.style.width = this.dimension.getWidthPixel();
  this.dom.style.height = this.dimension.getHeightPixel();
  // SOLORS AND THERE HERE
  this.dom.style.color = options.color;
  this.dom.style.background = options.bgColor;
  this.dom.style.border = options.border;

  // CONTENT STAFF
  this.dom.innerHTML = options.content;

  if (typeof onClick !== "undefined") {
    this.dom.addEventListener("click", onClick, false);
    console.info("Click event added.");
  }

  document.body.appendChild(this.dom);

  // auto update
  this.update = function () {
    this.dom.style.left = this.position.getXPixel();
    this.dom.style.top = this.position.getYPixel();
  };

  console.info("Rabbit Element " + this.name + " added.");
}
