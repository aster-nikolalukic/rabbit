
let MongoClient = require("mongodb").MongoClient;
const shared = require("./../common/shared");
const fs = require("fs");

/**
 * @description MyDatabase class
 * MongoDB Database used in this project version 4.4.2
 * JavaScript/NODE.JS fullstack project
 */
class MyDatabase {

  constructor(serverConfig) {
    this.config = serverConfig;
    this.sizeOfUsers = 0;
  }

  async populateDatabase() {
    const CreateDatabaseCollections = require("./create-collections");
    var databasePopulate = new CreateDatabaseCollections(this.config);
    var r = await databasePopulate.createCollections();
    console.log("Database create collections -> ", r);
  }

  async seedDatabase(numOfFakeUsers) {
    const SeedDatabaseCollections = require("./seed-collections");
    var databasePopulate = new SeedDatabaseCollections(this.config);
    var r = await databasePopulate.seedUsersCollection(numOfFakeUsers);
    console.log("Database seed finished -> ", r);
  }

  async checkInitiallyDatabaseSize() {
    var t = await this.checkInitiallyDatabaseSizeInternal();
    this.sizeOfUsers = t;
    console.log("Database size => ", t);
  }

  checkInitiallyDatabaseSizeInternal() {
    const databaseName = this.config.databaseName;
    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function(error, db) {
          if(error) {
            console.warn("MyDatabase: err1:" + error);
            resolve("SOMETHING_WRONG_WITH_checkInitiallyDatabaseSizeInternal");
            return;
          }
          const dbo = db.db(databaseName);
          var test = dbo.collection("users").countDocuments({})
          test.then((e) => {resolve(e)})
        })
    })
  }
  /**
   * Method register is called on singup user action.
   * @param {object} user
   *  email: user.userRegData.email
   *  user.userRegData.password
   * @param {classInstance} callerInstance
   */
  register(user, callerInstance) {

    /**
     * @description 
     * This line prevents method register
     * to be used by others classes.
     * ResponseHandler class is allowed.
     */
    /*
    if (callerInstance.constructor.name !== "RocketRoute") {
      console.error("callerInstance must be registred in database.js");
      return;
    }
    */

    const databaseName = this.config.databaseName;

    /**
     * Open connection with database.
     */
    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function(error, db) {
          if(error) {console.warn("MyDatabase : err1:" + error);
            resolve("SOMETHING_WRONG_WITH_REGISTRATION")
            return;
          }

          const dbo = db.db(databaseName);
          dbo.collection("users").findOne({email: user.email}, function(err, result) {
            if(err) {console.warn("MyDatabase err in register:" + err);
              resolve("SOMETHING_WRONG_WITH_REGISTRATION");
              return null;
            }

            if(result === null) {
              let uniqLocal = shared.generateToken(6);
              console.info("MyDatabase Register new user...");
              dbo.collection("users").insertOne(
                {
                  email: user.email,
                  password: callerInstance.crypto.encrypt(user.password),
                  nickname: "no" + shared.getDefaultNickName(),
                  confirmed: false,
                  token: uniqLocal,
                  socketid: user.socketId,
                  online: false,
                  points: 1000,
                  rank: "junior",
                  permission: "basic",
                  age: "any",
                  country: "any",
                  ban: false
                },
                function(err, res) {
                  if(err) {console.log("MyDatabase err3:" + err);return;}
                  var responseFromDatabaseEngine = {
                    status: "USER_REGISTERED",
                    email: user.email,
                    token: uniqLocal
                  };
                  db.close();
                  resolve(responseFromDatabaseEngine);
                }
              );
            } else {
              var responseFromDatabaseEngine = {
                status: "USER_ALREADY_REGISTERED",
                email: user.email,
                token: null,
              }
              db.close();
              resolve(responseFromDatabaseEngine);
            }
          });
        }
      )
    });
  }

  regValidator(user) {

    const databaseName = this.config.databaseName;
    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function(error, db) {
          if(error) {
            console.warn("MyDatabase error:" + error);
            resolve("SOMETHING_WRONG_MyDatabase_ACCESS");
            return;
          }

          const dbo = db.db(databaseName);
          console.log(">>>> user.token>>>>>> ", user.token)
          dbo.collection("users").findOne({email: user.email, token: user.token}, function(err, result) {
            if(err) {
              console.log("MyDatabase.regValidator 2:" + err);
              return null;
            }

            if(result !== null) {
              dbo
                .collection("users")
                .updateOne({email: user.email}, {$set: {confirmed: true, points: 100}}, function(err, result) {
                  if(err) {
                    console.info("MyDatabase, user confirmed err :" + err);
                    var local = {
                      result: null,
                      email: user.email
                    };
                    resolve(local);
                    return;
                  }
                  console.info("MyDatabase, user confirmed result:" + result);
                  var local = {
                    result: result,
                    email: user.email,
                    accessToken: user.token
                  };
                  resolve(local);
                });
            } else {
              // ? not tested
              console.warn("MyDatabase, update confirmed result ? not tested:" + result);
              // callerInstance.onRegValidationResponse(result, user.email, user.accessToken);
              var local = {
                result: result,
                email: user.email,
                accessToken: user.accessToken
              };
              resolve(local);
            }
          });
        }
      );
    });
  }

  loginUser(user, callerInstance) {

    const databaseName = this.config.databaseName;

    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot, { useNewUrlParser: true, useUnifiedTopology: true },
        function(error, db) {
          if(error) { console.warn("MyDatabase.login error: " + error); return; }

          const dbo = db.db(databaseName);

          console.warn("MyDatabase.login user => ", user);

          dbo.collection("users").findOne({email: user.email, confirmed: true}, {}, function(err, result) {
            if(err) {
              console.log("MyDatabase.login error: " + err);
              resolve("MyDatabase.login.error")
            }

            console.warn("MyDatabase.login result => ", result);

            if(result !== null) {
              // Secure
              const pass = callerInstance.crypto.decrypt(result.password);
              if(pass == user.password) {
                console.warn("Session passed.");
              } else {
                // handle bad cert
                console.warn("login.bad.password");
                const userData = {
                  status: "WRONG_PASSWORD",
                }
                resolve(userData);
              }
              // Security staff
              const userData = {
                status: "USER_LOGGED",
                email: result.email,
                nickname: result.nickname,
                points: result.points,
                rank: result.rank,
                token: result.token,
                profileImage: result.profileUrl
              };

              dbo.collection("users").updateOne({email: user.email}, {$set: {online: true}}, function(err, result) {
                if(err) {
                  console.log("BAD_EMAIL_OR_PASSWORD");
                  resolve("BAD_UPDATE_EMAIL_OR_PASSWORD")
                  return;
                }
                console.warn("ONLINE: ", userData.nickname);
                resolve(userData);
              })
            } else {
              resolve("BAD_EMAIL_OR_PASSWORD_OR_ANY")
            }
          })
        })
    })
  }

  getUserData(user) {
    const databaseName = this.config.databaseName;
    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function(error, db) {
          if(error) {
            console.warn("MyDatabase.login :" + error);
            resolve("error");
            return;
          }

          const dbo = db.db(databaseName);
          dbo
            .collection("users")
            .findOne({permission: "basic", online: true, confirmed: true}, function(err, result) {
              if(err) {
                console.log("MyDatabase.getUserData :" + err);
                return null;
              }
              if(result !== null) {
                // Security staff
                const userData = {
                  email: result.email,
                  points: result.points,
                  rank: result.rank,
                  nickname: result.nickname,
                  socketid: result.accessToken,
                  token: result.token,
                  profileImage: result.profileUrl
                };

                resolve(userData);
              } else {
                resolve("NONO");
              }
            });
        })
    })
  }

  setNewNickname(user) {

    const databaseName = this.config.databaseName;

    return new Promise((resolve) => {

      MongoClient.connect(
        this.config.getDatabaseRoot,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function(error, db) {
          if(error) {
            console.warn("MyDatabase.login err: " + error);
            return;
          }
          const dbo = db.db(databaseName);
          dbo.collection("users")
            .findOne({email: user.email, online: true, confirmed: true, token: user.token},
              function(err, result) {
                if(err) {
                  console.log("MyDatabase.setNewNickname err: " + err);
                  return null;
                }
                if(result !== null) {
                  const userData = {
                    status: "NICKNAME_CHANGED"
                  };
                  dbo.collection("users").updateOne(
                    {email: user.email}, {$set: {nickname: user.newNickname}},
                    function(err, result2) {
                      if(err) {
                        console.log("MyDatabase.setNewNickname (error in update):", err);
                        resolve({status: "ERROR IN NEW NICK NAME"});
                        return;
                      }
                      resolve(userData);
                    });
                }
              });
        });
    })
  }

  fastLogin(user, callerInstance) {
    const databaseName = this.config.databaseName;
    MongoClient.connect(
      this.config.getDatabaseRoot,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function(error, db) {
        if(error) {
          console.warn("MyDatabase.login error:" + error);
          return;
        }

        const dbo = db.db(databaseName);

        dbo
          .collection("users")
          .findOne({email: user.data.userLoginData.email, token: user.data.userLoginData.token, confirmed: true}, function(
            err,
            result
          ) {
            if(err) {
              console.log("MyDatabase.login :" + err);
              return null;
            }

            if(result !== null) {
              // Security staff
              const userData = {
                email: result.email,
                nickname: result.nickname,
                points: result.points,
                rank: result.rank,
                token: result.token,
                profileImage: result.profileUrl
              };

              dbo
                .collection("users")
                .updateOne({email: user.data.userLoginData.email}, {$set: {online: true}}, function(err, result) {
                  if(err) {
                    console.log("BAD_EMAIL_OR_PASSWORD");
                    return;
                  }
                  console.warn("online: ", userData.nickname);
                  callerInstance.onUserLogin(userData, callerInstance);
                });
            }
          });
      }
    );
  }

  logOut(user, callerInstance) {
    const databaseName = this.config.databaseName;
    MongoClient.connect(
      this.config.getDatabaseRoot,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function(error, db) {
        if(error) {
          console.warn("MyDatabase.login error:" + error);
          return;
        }

        const dbo = db.db(databaseName);

        dbo.collection("users").findOne({token: user.data.token, confirmed: true}, function(err, result) {
          if(err) {
            console.log("MyDatabase.logout :" + err);
            return null;
          }

          if(result !== null) {
            // Security staff
            const userData = {
              email: result.email,
              nickname: result.nickname,
              points: result.points,
              rank: result.rank,
              token: result.token
            };

            dbo.collection("users").updateOne({email: userData.email}, {$set: {online: false}}, function(err, result) {
              if(err) {
                console.log("warn: logout bad access!");
                return;
              }
              console.warn("logout: ", userData.nickname);
              callerInstance.onLogOutResponse(userData, callerInstance);
            });
          }
        });
      }
    );
  }

  forgotPass(user, callerInstance) {
    console.log(">>>> uiser", user)
    return new Promise((resolve) => {
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {useNewUrlParser: true, useUnifiedTopology: true},
      function(error, db) { if(error) {console.warn("MyDatabase.forgotPassword.err1:" + error); return;}
        const dbo = db.db(databaseName);
        dbo.collection("users").findOne({email: user.email}, function(err, result) {
          if(err) {console.log("MyDatabase.forgotPassword => " + err); return null;}
          if(result !== null) {
            var FTOKEN = shared.generateToken(5);
            dbo
              .collection("users")
              .updateOne({email: user.email}, {$set: {ftoken: FTOKEN}}, {multi: true}, function(err, r1) {
                if(err) {console.warn("MyDatabase.FTOKEN err2 => " + err); return;}
                if(r1 != null) {
                  console.warn("MyDatabase UPDATE FTOKEN. r1.nModified  " + r1.nModified );
                  resolve({ status: "FTOKEN CREATED", email: user.email, ftoken: FTOKEN });
                  db.close();
                }
                else {
                  resolve({status: "FTOKEN-FAIL1"});
                  db.close();
                }
              });
          } else {
            resolve({status: "FTOKEN-FAIL2"});
            console.log("There is no registred email. leave it with no server action.");
            db.close();
          }
        });
      });
    });
  }

  setNewPass(user, callerInstance) {
    console.log(">>>> uiser VVVVV ", user)
    return new Promise((resolve) => {
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {useNewUrlParser: true, useUnifiedTopology: true},
      function(error, db) { if(error) {console.warn("MyDatabase.forgotPassword.err1:" + error); return;}
        const dbo = db.db(databaseName);
        dbo.collection("users").findOne({email: user.email, ftoken: user.ftoken}, function(err, result) {
          if(err) {console.log("MyDatabase.setnewpass => " + err); return null;}
          if(result !== null) {
            var FTOKEN = shared.generateToken(5);
            dbo
              .collection("users")
              .updateOne({email: user.email}, {$set: {password: callerInstance.crypto.encrypt(user.newPassword)}}, function(err, r1) {
                if(err) {console.warn("MyDatabase.setNewPassword err => " + err); return;}
                if(r1 != null) {
                  console.log("NICE NICE r1.nModified  ", r1.nModified );
                  resolve({status: "NEW-PASS-DONE"})
                } else {
                  console.log("Waooo.");
                  resolve({status: "NEWPASS-FAIL4"});
                }
              });
          } else {
            resolve({status: "NEWPASS-FAIL3"});
            console.log("Waooo.");
            db.close();
          }
        });
      });
    });
  }

  getUsersList(user, callerInstance) {
    var root = this;
    const databaseName = this.config.databaseName;

    return new Promise((resolve) => {
      MongoClient.connect(
        this.config.getDatabaseRoot, {useNewUrlParser: true, useUnifiedTopology: true},
        function(error, db) {
          if(error) {
            console.warn("MyDatabase.getUsersList :" + error);
            resolve({status: 'error in MyDatabase getUsers'})
            return;
          }
          const dbo = db.db(databaseName);
          dbo.collection("users").findOne({token: user.token, confirmed: true, online: true}, {}, function(err, result) {
            if(err) {
              console.log("MyDatabase.login error: " + err);
              resolve("MyDatabase.login.error");
            }
            // console.warn("MyDatabase.login result => ", result);
            if(result !== null) {
              // Secure
              // const pass = callerInstance.crypto.decrypt(result.password);
              if(user.token) {
                console.warn("Session passed.");
                var coll = dbo.collection("users");
                var skipValue = 0;
                var limitValue = 500;
                //  resolve({ status: "WRONG_" }); NEED FIX
                if(user.criterium.description == 'list-all') {
                  // 
                  if(user.criterium.moreExploreUsers == 1) {
                    skipValue += limitValue;
                  }
                  console.log("Good ")
                }
                coll.find().skip(skipValue).limit(limitValue).toArray(function(err, result) {

                  if(err) {
                    console.log("error in get user list.");
                    resolve({status: 'error in getUsers'})
                  } else {

                    var usersData = {
                      status: "AUTHORIZED",
                      users: []
                    };
                    result.forEach(function(item, index) {
                      var reduceName = "users-shared-data/no-image.jpg";
                      if(typeof item.profileUrl !== 'undefined') {
                        reduceName = item.profileUrl.replace("public", "");
                      }
                      var user = {};
                      user.id = item._id;
                      user.nickname = item.nickname;
                      user.points = item.points;
                      user.rank = item.rank;
                      user.online = item.online;
                      user.email = item.email;
                      user.confirmed = item.confirmed;
                      user.profileImage = reduceName;
                      usersData.users.push(user);
                    });
                    resolve(usersData);
                  }
                });

              } else {
                resolve({status: "WRONG_PASSWORD"});
              }
            } else {
              console.warn("RESULT NULL");
              resolve("MyDatabase.no.results");
              db.close();
            }
          });
        })
    })
  }

  saveProfileImageAddress(user, callerInstance) {
    // console.log("MyDatabase.saveProfileImageAddress user.data: ", user.data);
    const databaseName = this.config.databaseName;
    MongoClient.connect(
      this.config.getDatabaseRoot,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function(error, db) {
        if(error) {
          console.warn("MyDatabase.login error:" + error);
          return;
        }
        const dbo = db.db(databaseName);
        dbo
          .collection("users")
          .findOne({socketid: user.data.accessToken, online: true, confirmed: true}, function(err, result) {
            if(err) {
              console.log("MyDatabase.setNewNickname (user not found by accessToken):" + err);
              return null;
            }

            if(result !== null) {

              const userData = {
                accessToken: user.data.accessToken
              };

              var userFolder = "public/users-shared-data/";
              if(!fs.existsSync(userFolder)) {
                fs.mkdirSync(userFolder);
              }
              userFolder += result.token;
              if(!fs.existsSync(userFolder)) {
                fs.mkdirSync(userFolder);
              }

              var generatedPathProfileImage = userFolder + "/profileImage.png";
              var base64Data = "";

              if(user.data.photo.indexOf("jpeg;base64") !== -1) {
                base64Data = user.data.photo.replace(/^data:image\/jpeg;base64,/, "");
              } else if(user.data.photo.indexOf("png;base64") !== -1) {
                base64Data = user.data.photo.replace(/^data:image\/png;base64,/, "");
              } else {
                console.log("MyDatabase.saveProfileImageAddress ERROR with photo data.");
                return;
              }

              fs.writeFile(generatedPathProfileImage, base64Data, "base64", function(err) {
                if(err) throw err;
                // file has been written to disk
                console.log("Photo profile saved.");
              });

              // console.log("user.data.accessToken: ", user.data.accessToken);

              dbo
                .collection("users")
                .updateOne(
                  {socketid: user.data.accessToken},
                  {$set: {"profileUrl": generatedPathProfileImage}},
                  function(err, result2) {
                    if(err) {
                      console.log("MyDatabase.saveProfileImageAddress (error in update profileUrl field):", err);
                      return;
                    }
                    var userData = {
                      profilePhotoAdded: "Profile photo added.",
                      accessToken: user.data.accessToken
                    };
                    // console.log("result2: ", result2);
                    callerInstance.onUserNewProfileImage(userData, callerInstance);
                  }
                );
            }
          });
      }
    );
  }
}

module.exports = MyDatabase;
