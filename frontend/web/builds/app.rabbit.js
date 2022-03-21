(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _genesis = require("./js/genesis.js");

var _loader = require("./js/loader.js");

var _operation = require("./js/operation.js");

let App = {
  name: 'Test rabbit run',
  version: '0.0.1',
  config: {
    apiDomain: 'http://localhost:8080'
  },
  root: document.getElementById('root'),
  showLoginForm: _loader.showLoginForm,
  showRegisterForm: _loader.showRegisterForm,
  loginUser: _operation.loginUser,
  registerUser: _operation.registerUser
}; ///////////////////////////////////////////
// This is just aprooach with genessis js
///////////////////////////////////////////

exports.App = App;
console.log("Try to create rabbit element -> Now ->");
var options = {
  content: "Show Login Form",
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

var showLoginFormBtn = function (e) {
  App.showLoginForm();
};

let showLoginFormDom = new _genesis.rabbitElement(options, () => App.showLoginForm());
options.position.y = 35;
let showRegisterFormDom = new _genesis.rabbitElement(options, () => App.showRegisterForm());

},{"./js/genesis.js":2,"./js/loader.js":3,"./js/operation.js":5}],2:[function(require,module,exports){
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

},{"./math.js":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlHeader = void 0;
exports.showLoginForm = showLoginForm;
exports.showRegisterForm = showRegisterForm;

var _utils = require("./utils.js");

const htmlHeader = new Headers({
  "Content-Type": "text/html",
  "Accept": "text/plain"
});
exports.htmlHeader = htmlHeader;

function showLoginForm() {
  const myInstance = this;
  fetch("./pages/login.html", {
    headers: htmlHeader
  }).then(res => {
    return res.text();
  }).then(html => {
    myInstance.root.innerHTML = html;
    (0, _utils.byId)("login-button").addEventListener("click", myInstance.loginUser, false);
    (0, _utils.byId)("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
  }).catch(function (err) {
    console.warn("Error in showLoginForm : ", err);
    (0, _utils.byId)("error-msg-reg").innerHTML = err;
  });
}

function showRegisterForm() {
  const myInstance = this;
  fetch("./pages/register.html", {
    headers: htmlHeader
  }).then(function (res) {
    return res.text();
  }).then(function (html) {
    myInstance.root.innerHTML = html;
    (0, _utils.byId)("reg-button").addEventListener("click", myInstance.registerUser, false);
    (0, _utils.byId)("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
  }).catch(function (err) {
    console.warn("Error in showLoginForm : ", err);
    (0, _utils.byId)("error-msg-reg").innerHTML = err;
  });
}

},{"./utils.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomIntFromInterval = randomIntFromInterval;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = loginUser;
exports.registerUser = registerUser;

var _app = require("../app.js");

var _utils = require("./utils.js");

/**
 * @description
 * Used in this [class] file only for now.
 */
function callApi(apiRoute, data, callback) {
  fetch(_app.App.config.apiDomain + apiRoute, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    callback(data);
  }).catch(err => {
    console.log(err);
    callback(err);
  });
}

function loginUser(e) {
  console.log("loginUser...");
  e.preventDefault();
  const localEmail = (0, _utils.byId)("login-user").value;
  const localPassword = (0, _utils.byId)("login-pass").value;

  if ((0, _utils.validateEmail)(localEmail) !== null) {
    (0, _utils.byId)("error-msg").style.display = "block";
    (0, _utils.byId)("error-msg").innerText = (0, _utils.validateEmail)(localEmail);
  }

  if ((0, _utils.validatePassword)(localPassword) === false) {
    (0, _utils.byId)("error-msg").style.display = "block";
    (0, _utils.byId)("error-msg").innerText += "Password is not valid! length!";
  }

  if ((0, _utils.validateEmail)(localEmail) === null && (0, _utils.validatePassword)(localPassword) === true) {
    const userData = {
      email: localEmail,
      password: localPassword
    };
    let localMsg = {
      action: "LOGIN",
      data: {
        userLoginData: userData
      }
    };
    callApi("/rabbit/login/", localMsg, e => {
      console.log('WHAT IS THE RESPONSE -> ', e);
    });
    localMsg = null;
  }
}

function registerUser(e) {
  e.preventDefault();
  const localEmail = (0, _utils.byId)("reg-user").value;
  const localPassword = (0, _utils.byId)("reg-pass").value;

  if ((0, _utils.validateEmail)(localEmail) !== null) {
    (0, _utils.byId)("error-msg-reg").style.display = "block";
    (0, _utils.byId)("error-msg-reg").innerText = (0, _utils.validateEmail)(localEmail);
  }

  if ((0, _utils.validatePassword)(localPassword) === false) {
    (0, _utils.byId)("error-msg-reg").style.display = "block";
    (0, _utils.byId)("error-msg-reg").innerText = "Password is not valid! length!";
  }

  if ((0, _utils.validateEmail)(localEmail) === null && (0, _utils.validatePassword)(localPassword) === true) {
    const userData = {
      email: localEmail,
      password: localPassword
    };
    let localMsg = {
      action: "REGISTER",
      data: {
        userRegData: userData
      }
    };
    callApi("/rabbit/register/", localMsg, e => {
      console.log('register/ RESPONSE => ', e);
    });
    localMsg = null;
  }
}

},{"../app.js":1,"./utils.js":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byId = byId;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;

function byId(id) {
  return document.getElementById(id);
}

function validateEmail(email) {
  // tslint:disable-next-line:max-line-length
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  if (regexp.test(email) === false) {
    return "Email is not valid !";
  }

  return null;
}

function validatePassword(pass) {
  if (pass.length < 8) {
    return false;
  }

  return true;
}

},{}]},{},[1]);
