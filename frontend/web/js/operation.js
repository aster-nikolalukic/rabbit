
import { App, showLoginRabbitBtn, showRegisterRabbitBtn } from '../app.js';
import { validateEmail, validatePassword, byId } from './utils.js';
import { onUserConfirmed, userRegisterConfirmation } from './responseHandler.js';
/**
 * @description
 * Used in this [class] file only for now.
 */
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
    byId("error-msg").style.display = "block";
    byId("error-msg").innerText = validateEmail(localEmail);
  }

  if(validatePassword(localPassword) === false) {
    byId("error-msg").style.display = "block";
    byId("error-msg").innerText += "Password is not valid! length!";
  }

  if(validateEmail(localEmail) === null && validatePassword(localPassword) === true) {

    const userData = {
      email: localEmail,
      password: localPassword,
    };

    let localMsg = {action: "LOGIN", data: {userLoginData: userData}};
    callApi("/rabbit/login/", localMsg, (res) => {
      console.log('Login response -> ', e);
      if (res.rabbitStatus == 'USER_LOGGED') {
        showRegisterRabbitBtn.position.translateByY(110);
        showLoginRabbitBtn.position.translateByY(110);
        App.showLeftMenu();
        App.showUserProfileForm(res);
      }
    });
    localMsg = null;

  }
}

export function registerUser(e) {

  e.preventDefault();

  const localEmail = byId("reg-user").value;
  const localPassword = byId("reg-pass").value;

  if (validateEmail(localEmail) !== null) {
    byId("error-msg").style.display = "block";
    byId("error-msg").innerText = validateEmail(localEmail);
  }

  if (validatePassword(localPassword) === false) {
    byId("error-msg").style.display = "block";
    byId("error-msg").innerText =+ "Password is not valid! length!";
  }

  if (validateEmail(localEmail) === null && validatePassword(localPassword) === true) {

    const userData= {
      email: localEmail,
      password: localPassword,
    };

    let localMsg = { action: "REGISTER", data: { userRegData: userData } };
    callApi("/rabbit/register/", localMsg, (e) => {
      console.log('register/ RESPONSE => ', e)
      userRegisterConfirmation(e, this);
    });

  }

}

export function confirmRegistration(e) {

  e.preventDefault();

  const localEmail = byId("reg-user").value;
  const localPassword = byId("reg-pass").value;

  if (validateEmail(localEmail) !== null) {
    byId("error-msg").style.display = "block";
    byId("error-msg").innerText = validateEmail(localEmail);
  }

  if (validateEmail(localEmail) === null) {

    const userData= {
      email: localEmail,
      code: localPassword,
    };

    let localMsg = { action: "REGISTER-CONFIRMATION", data: { userRegData: userData } };
    callApi("/rabbit/confirmation", localMsg, (e) => {
      console.log('/rabbit/confirmation/ RESPONSE => ', e)
      onUserConfirmed(e);
    });
  }
}