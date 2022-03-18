
export function byId(id) {
  return document.getElementById(id);
}

export function validateEmail(email) {
  // tslint:disable-next-line:max-line-length
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (regexp.test(email) === false) {
    return "Email is not valid !";
  }
  return null;
}

export function validatePassword(pass) {
  if (pass.length < 8) {
    return false;
  }
  return true;
}
