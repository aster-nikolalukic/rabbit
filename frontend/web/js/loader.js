import { byId } from './utils.js';

export const htmlHeader = new Headers({
  "Content-Type": "text/html",
  "Accept": "text/plain",
});

export function showLoginForm() {
  const myInstance = this;
  fetch("./pages/login.html", {
    headers: htmlHeader,
  }).
    then((res) => {
      return res.text();
    }).then((html) => {
      myInstance.root.innerHTML = html;
      byId("login-button").addEventListener("click", myInstance.loginUser, false);
      // byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
    }).catch(function(err) {
      console.warn("Error in showLoginForm : ", err);
      byId("error-msg").innerHTML = err;
    });
}

export function showRegisterForm() {
  const myInstance = this;
  fetch("./pages/register.html", {
    headers: htmlHeader,
  }).
    then(function(res) {
      return res.text();
    }).then(function(html) {
      myInstance.root.innerHTML = html;
      byId("reg-button").addEventListener("click", myInstance.registerUser, false);
      // byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
    }).catch(function(err) {
      console.warn("Error in showLoginForm : ", err);
      byId("error-msg").innerHTML = err;
    });
}