
const ResponseHandler = require("./profile-handler")

/**
 * @description Class RabbitRouteProfile
 * is place for definition of route jobs
 * also ResponseHandler comes in same folder
 * with one route api collections egg.
 * `api/account`.
 */
class RabbitRouteProfile extends ResponseHandler {

  /**
   * @description 
   * Keep it simple.
   */
  constructor(app, express, dataOptions, crypto) {

    super(crypto, dataOptions);

    this.app = app;
    this.express = express;
    this.dataOptions = dataOptions;

    this.routeRegister();
    
  }

  routeRegister() {

    this.app.post("/rabbit/profile", this.getProfileResponse.bind(this));
    this.app.post("/rabbit/profile/newNickname", this.profileNewNickname.bind(this));
    console.log("getProfileResponse loaded with success.");

  }

}

module.exports = (app, express, dataOptions, crypto) => { return new RabbitRouteProfile(app, express, dataOptions, crypto) }
