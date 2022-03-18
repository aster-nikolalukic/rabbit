
const ResponseHandler = require("./handler")

/**
 * @description Class RabbitAccountRoute
 * is place for definition of route jobs
 * also ResponseHandler comes in same folder
 * with one route api collections egg.
 * `api/account`.
 */
class RabbitAccountRoute extends ResponseHandler {

  /**
   * @description
   * Keep it simple.
   */
  constructor(app, express, dataAction, crypto) {

    super(crypto);

    this.app = app;
    this.express = express;
    this.dataAction = dataAction;

    this.routeRegister();

  }

  routeRegister() {

    this.app.post("/rabbit/login", this.onLoginResponse.bind(this));
    this.app.post("/rabbit/register", this.onRegisterResponse.bind(this));
    this.app.post("/rabbit/confirmation", this.onRegValidationResponse.bind(this));
    this.app.post("/rabbit/forgot-pass", this.onForgotNewPassworkResponse.bind(this));
    this.app.post("/rabbit/set-new-pass", this.onSetNewPassworkResponse.bind(this));
    console.log("RabbitAccountRoute for account loaded with success.");

  }

}

module.exports = (app, express, dataAction, crypto) => { return new RabbitAccountRoute(app, express, dataAction, crypto) }
