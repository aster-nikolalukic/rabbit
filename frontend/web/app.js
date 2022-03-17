


import { rabbitElement } from './js/genesis.js';
console.log("NICE");
console.log("Try to create rabbit element -> Now ->");


/**
 * Vanilla js
 */

// Mora van {} ako zelimo global access kroz console
var objekat = null;

window.onload = function() {

  // objekat je instanca klase myElement

  var options = {
    // name: 'MojElement', // uniq
    content: "ja sam dugme",
    position: { x: 45 , y : 25 },
    bgColor: 'black',
    color: 'lime',
    border: 'solid lime 1px',
    dimension: { width: 15 , height: 15 },
  };

  var testClick = function() {
    alert("COOL MAN")
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
  */



  /** Kad prebacis nesto na `this.`
   *  onda je to postao property te klase i lako mozes pristupiti
   *  na sledeci nacin.
   */
   // console.log("Access objekt => ", objekat.dom.innerHTML)


  /**
   * I na kraju manipulacija
   */
  setTimeout(function() {
    objekat.position.translateByX(50)
    objekat.position.translateByY(50)
  }, 2000)

}



