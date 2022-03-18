
import {rabbitElement} from './js/genesis.js';
import {
  showLoginForm,
  showRegisterForm
} from './js/loader.js';
import {
  loginUser,
  registerUser
} from './js/operation.js';

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
  registerUser: registerUser,
};


///////////////////////////////////////////
// This is just aprooach with genessis js
///////////////////////////////////////////

console.log("Try to create rabbit element -> Now ->");


var options = {
  content: "Show Login Form",
  position: {x: 45, y: 25},
  bgColor: 'black',
  color: 'lime',
  border: 'solid lime 1px',
  dimension: {width: 15, height: 15},
};

var showLoginFormBtn = function(e) {
  App.showLoginForm();
};

let showLoginFormDom = new rabbitElement(options, () => App.showLoginForm());


options.position.y = 35;
let showRegisterFormDom = new rabbitElement(options, () => App.showRegisterForm() );

