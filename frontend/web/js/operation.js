
import { App } from '../app.js';
import { validateEmail, validatePassword, byId } from './utils.js';

function callApi(apiRoute, data, callback) {

  fetch(App.config.apiDomain + apiRoute, { method: 'POST', headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, body: JSON.stringify(data)}).
  then((response) => {
    return response.json()
  }).
  then((data) => {
    console.log(data)
    callback(data);
  }).
  catch((err) => {
    console.log(err)
    callback(err);
  });

}

export function loginUser(e) {
  console.log("loginUser...");
  e.preventDefault();

  const localEmail = byId("login-user").value;
  const localPassword = byId("login-pass").value;

  if(validateEmail(localEmail) !== null) {
    byId("error-msg-login").style.display = "block";
    byId("error-msg-login").innerText = validateEmail(localEmail);
  }

  if(validatePassword(localPassword) === false) {
    byId("error-msg-login").style.display = "block";
    byId("error-msg-login").innerText += "Password is not valid! length!";
  }

  if(validateEmail(localEmail) === null && validatePassword(localPassword) === true) {

    const userData = {
      email: localEmail,
      password: localPassword,
    };

    let localMsg = {action: "LOGIN", data: {userLoginData: userData}};
    callApi("/rabbit/login/", localMsg, (e) => {
      console.log('WHAT IS THE RESPONSE -> ', e)
    });
    localMsg = null;

  }
}