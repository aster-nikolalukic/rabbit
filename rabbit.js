/**
 * @description Rabbit
 * @version 2022 Runner
 * @author Nikola Lukic
 * @company Astermedia.net 2022
 * @licence  GNU GENERAL PUBLIC LICENSE V3
 * @objective Nice for learning to use power of node.js
 */

console.log("Initial params [3] => ", process.argv[3]);

let path = require("path");

const spdy = require("spdy");
const compression = require("compression");
const cors = require("cors");
let express = require("express");
let fs = require("fs");
const Crypto = require("./common/crypto");
let crypto = new Crypto();
var https = require("https");
var http = require("http");

let hostingHTTP = express();

const ConfigAccountSession = require("./config");
const config = new ConfigAccountSession(process.argv[3]);

const MyDatabase = require("./database/database");
let database = new MyDatabase(config);

/**
 * @description Create if not exist
 * all defined collections.
 * @collections
 *  - users
 */
database.populateDatabase();
database.checkInitiallyDatabaseSize();

/**
 * @description Seed fake users
 * all defined collections.
 * No programibillity prevent double
 * seed. Just comment line manually.
 * @collections
 *  - users
 */
database.seedDatabase(3);

// Check launch arguments: must receive URL (localhost) and the secret
if (process.argv.length != 4) {
  console.log("Usage: node " + __filename + " . ");
  process.exit(-1);
}

// For demo purposes we ignore self-signed certificate
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var bodyParser = require("body-parser");
var app = express();
var URL_ARG = process.argv[2];
var options = null;

/**
 * @description
 * Define sub domains.
 */
// this.app.use(root.express.static(__dirname + "./../../admin-panel/dist"));

const vhost = require("vhost");
/*
let routerSub = express.Router();
routerSub.use(express.static("/var/www/html/apps/SOME_PATH/"));
hostingHTTP.use(vhost("games.domain.com", routerSub));
hostingHTTP.get("*", function (req, res, next) {
  console.log("test web server ... " , req.hostname);
   if (req.hostname == "ai.maximumroulette.com") {
     //console.log(" REDIRECT NOW " )
     //req.location = "/apps/ai/";
     //res.sendFile("/apps/ai/index.html");
     //res.end();
   } 
  next();
}); */

hostingHTTP.use(express.static("/var/www/html/"));

// Compress all HTTP responses
hostingHTTP.use(compression());

hostingHTTP.use(cors());

hostingHTTP.use(function (req, res, next) {
  // res.setHeader("Content-Type", "text/html")
  res.setHeader("Content-Encoding", "gzip");
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);
  // Pass to next layer of middleware
  next();
});


app.use(bodyParser.json({limit: config.maxRequestSize}));
app.use(cors());

/**
 * @description
 * You can add samo special route for any proporse.
 * Not work if you have 443 https started at same domain,
 * it redirect to https and rocket crating server hostend on 80
 * is not reached.
 *
 */
if (config.hostSpecialRoute.active) {

  app.use("/admin", express.static(config.hostSpecialRoute.route));
  console.info(
    "Rocket activate " +
      config.hostSpecialRoute.webAppName +
      " application host." +
      " Application www folder is `" +
      config.hostSpecialRoute.route +
      " __dirname is " +
      __dirname
  );
}

/**
 * @description Compression
 * @example
 *  app.use(compression({
 *    filter: function () { return true; }
 *  }));
 *  express.compress()
 */

/**
 * @description  Allow or disallow headers flags.
 * Add headers
 */
app.use(function (req, res, next) {
  // console.log("HOSTING SERVER PREVENT OTHER DOMAINS+")
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);
  // Pass to next layer of middleware
  next();
});

// Parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: "true",
  })
);

// Parse application/json
app.use(bodyParser.json());

app.use(
  bodyParser.json({
    type: "application/vnd.api+json",
  })
);

// hostAdminPanel

let routerProfileDeleteAdmin = new require("./api/admin/admin-profile")(
  app,
  express,
  {
    dbName: config.databaseName,
    dbRoot: config.getDatabaseRoot,
    database: database,
  },
  crypto
);

// Parse application/vnd.api+json as json

let routerRocket = new require("./api/account/account")(
  app,
  express,
  database,
  crypto
);
let routerUsers = new require("./api/users/users")(
  app,
  express,
  database,
  crypto
);

// Test - Not for production
// let routerGeneric = new require('./api/generic/route')(app, express, database, crypto);

let routerProfile = new require("./api/profile/profile")(
  app,
  express,
  {
    dbName: config.databaseName,
    dbRoot: config.getDatabaseRoot,
    database: database,
  },
  crypto
);

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

/**
 * @description
 * Forsed https for now.
 * For local pass arg `localhost`
 */
if (URL_ARG.indexOf("localhost") !== -1) {
  options = {
    key: fs.readFileSync(__dirname + "/self-cert/privatekey.pem"),
    cert: fs.readFileSync(__dirname + "/self-cert/certificate.pem"),
  };
} else {
  options = {
    key: fs.readFileSync("/etc/letsencrypt/live/DOMAIN/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/DOMAIN/fullchain.pem"),
  };
}

/**
 * @description
 * Init on the end.
 */
var serverRunner = null;

if (config.protocol == "http") {
  serverRunner = http;
} else if (config.protocol == "https") {
  serverRunner = https;
} else if (config.protocol == "http2") {
  serverRunner = spdy;
}

/**
 * @description serverRunner
 * Run `rabbit` web server.
 */
serverRunner.createServer(options, app).listen(config.connectorPort, error => {
  if (error) {
    console.warn("Something wrong with rocket-crafting server.");
    console.error(error);
    return process.exit(1);
  } else {
    console.log("Rabbit started at " + config.connectorPort + " port.");
  }
});

/**
 * @description
 * If yuo need bonus unsecured web host in some reasons
 * then simple activate from config [ownHttp].
 */
if (config.ownHttp) {
  https
    .createServer(options, hostingHTTP)
    .listen(config.ownHttpHostPort, error => {
      if (err) {
        console.warn("Something wrong with rocket-craft own host server.", err);
        return process.exit(1);
      } else {
        console.info("Rabbit helper unsecured host started at " + config.ownHttpHostPort + " port.");
      }
    });
}