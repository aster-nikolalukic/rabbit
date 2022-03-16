
let MongoClient = require("mongodb").MongoClient;
// const shared = require("./../common/shared");
// const fs = require("fs");

/**
 * MyDatabase class
 * MongoDB Database used in this project
 * version 4.4.2
 * JavaScript fullstack project
 */
class CreateDatabaseCollections {

  constructor(serverConfig) {
    this.config = serverConfig;
  }

  createCollections() {

    const r1 = this.createUsersCollection();
    return r1;
  }

  /**
   * Method register is called on singup user action.
   * @param {object} user
   *  email: user.userRegData.email
   *  user.userRegData.password
   * @param {classInstance} callerInstance
   */
  createUsersCollection() {

    var root = this;
    const databaseName = this.config.databaseName;

    /**
     * @description
     * Create `users` collections.
     */
    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (error, db) {
          if (error) {
            console.warn("MyDatabase  error:" + error);
            return;
          }
          const dbo = db.db(databaseName);
          if (!dbo.collection("users")) {
            dbo.createCollection("users").createIndex({ email: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ password: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ socketid: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ confirmed: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ token: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ online: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ nickname: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ points: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ profileUrl: 1 }, { unique: true });
            dbo.createCollection("users").createIndex({ permission: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ age: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ country: 1 }, { unique: false });
            dbo.createCollection("users").createIndex({ ban: 1 }, { unique: false });
            resolve("Collections users created.")
          } else {
            resolve("Collections users already exist.")
          }
        });
    });
  }

}

module.exports = CreateDatabaseCollections;
