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
      console.log("what i s" , myInstance)
      myInstance.root.innerHTML = html;
      byId("login-button").addEventListener("click", myInstance.loginUser, false);
      byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
      console.log("what i s" , myInstance)
      //  byId("error-msg-reg").innerHTML = data.data.text;
    }).catch(function(err) {
      console.warn("Error in showLoginForm : ", err);
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
      byId("login-button").addEventListener("click", myInstance.loginUser, false);
      byId("sing-up-tab").addEventListener("click", myInstance.showRegisterForm, false);
      //  byId("error-msg-reg").innerHTML = data.data.text;
    }).catch(function(err) {
      console.warn("Error in showLoginForm : ", err);
    });
}