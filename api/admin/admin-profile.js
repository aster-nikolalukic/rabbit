
const ResponseHandler = require("./admin-profile-handler");

/**
 * @description Class alias RabbitRouteProfileAdmin
 * RabbitRouteProfileAdmin
 * is place for definition of route jobs
 * also ResponseHandler comes in same folder
 * with one route api collections egg.
 * `rocket/profile-delete`.
 */
class RabbitRouteProfileAdmin extends ResponseHandler {

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
    // Only admin permission
    this.app.post("/rabbit/profile-delete", this.ProfileDeleteResponse.bind(this));
    // this.app.post("/rabbit/profile-ban", this.ProfileDeleteResponse.bind(this));
    console.log("RabbitRouteProfileAdmin loaded with success.");
  }

}

module.exports = (app, express, dataOptions, crypto) => { return new RabbitRouteProfileAdmin(app, express, dataOptions, crypto) }
