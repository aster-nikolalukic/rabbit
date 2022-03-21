
import {rabbitElement} from './js/genesis.js';
import {
  showLoginForm,
  showRegisterForm
} from './js/loader.js';
import {
  loginUser,
  registerUser,
  confirmRegistration
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
  confirmRegistration: confirmRegistration
};

///////////////////////////////////////////
// This is just aprooach with genessis js
// creating html dom elements from code.
///////////////////////////////////////////
console.log("Try to create rabbit element -> Now ->");

var options = {
  content: "<div class='centeredAbs' >Login Form</div>",
  position: {x: 45, y: 25},
  bgColor: 'var(--primary)',
  color: 'var(--therme)',
  border: 'solid var(--therme) 1px',
  dimension: {width: 15, height: 5},
};

let showLoginFormDom = new rabbitElement(options, () => App.showLoginForm());

options.content = "Register form";
options.position.y = 35;
let showRegisterFormDom = new rabbitElement(options, () => App.showRegisterForm() );
