import { byId } from './utils.js';
import { loadUserProfile } from './responseHandler.js';

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

export function showLeftMenu() {
  const myInstance = this;
  fetch("./pages/left-menu.html", {
    headers: htmlHeader,
  }).
    then(function(res) {
      return res.text();
    }).then(function(html) {
      myInstance.leftMenu.innerHTML = html;
      // byId("reg-button").addEventListener("click", myInstance.registerUser, false);
    }).catch(function(err) {
      console.warn("Error in showLoginForm : ", err);
      byId("error-msg").innerHTML = err;
    });
}

export function showUserProfileForm(data) {
  const myInstance = this;
  fetch("./pages/user-profile.html", {
    headers: htmlHeader,
  }).
    then(function(res) {
      return res.text();
    }).then(function(html) {
      myInstance.root.innerHTML = html;
      loadUserProfile(data);
    }).catch(function(err) {
      console.warn("Error in showUserProfileForm: ", err);
      byId("error-msg").innerHTML = err;
    });
}