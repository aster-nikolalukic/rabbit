import { App } from '../app.js';
import { validateEmail, validatePassword, byId } from './utils.js';

export function userRegisterConfirmation(res, INSTANCE ) {
  const myInstance = this;
  if (res.rabbitStatus == "USER_REGISTERED") {
    alert("USER_REGISTERED -> " + res.message);
    byId('reg-pass-label').innerText = 'CODE';
    byId('reg-button').innerText = 'CONFIRM MY REGISTRATION';
    byId("reg-button").removeEventListener("click", App.registerUser);
    alert("myInstance  -> " + App.confirmRegistration);
    byId("reg-button").addEventListener("click", App.confirmRegistration, false);

  }

}

export function onUserConfirmed(e) {
  console.log("onUserConfirmed -> " + e);
}

export function loadUserProfile(data) {
  byId('user-email').value = data.flag.email;
  byId('user-rank').value = data.flag.rank;
  byId('user-points').value = data.flag.points;
  byId('user-nickname').value = data.flag.nickname;
}