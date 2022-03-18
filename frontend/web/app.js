
import { rabbitElement } from './js/genesis.js';
import { 
  showLoginForm,
  showRegisterForm
 } from './js/loader.js';
 import { loginUser } from './js/operation.js';

export let App = {

  name: 'Test rabbit run',
  version: '0.0.1',

  config: {
    apiDomain: 'http://localhost:8080'
  },

  root: document.getElementById('root'),
  showLoginForm: showLoginForm,
  showRegisterForm: showRegisterForm,
  loginUser: loginUser,
};


///////////////////////////////////////////
// This is just aprooach with genessis js
///////////////////////////////////////////

console.log("Try to create rabbit element -> Now ->");

var objekat = null;
  var options = {
    content: "Show Login Form",
    position: { x: 45 , y : 25 },
    bgColor: 'black',
    color: 'lime',
    border: 'solid lime 1px',
    dimension: { width: 15 , height: 15 },
  };

  var testClick = function(e) {
    console.log("COOL MAN, event - ", e)
    console.log("COOL MAN, App  - ", App.showLoginForm() )
  };

  objekat = new rabbitElement(options, testClick);

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
  // setTimeout(function() {
    //objekat.position.translateByX(50);
    //objekat.position.translateByY(50);
  // }, 2000);
  */