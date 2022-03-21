/**
 * @description Define backend config staff here.
 * @param serverMode { `dev` `prod` `mongodb.net` }
 * @param networkDeepLogs { Boolean }
 * @param connectorPort { number }
 */

 class ServerConfig {

  constructor(serverModeArg) {
    if (typeof serverModeArg === 'undefined') {
      this.serverMode = "dev";
    } else if (serverModeArg == 'prod' ||
               serverModeArg == 'dev' ||
               serverModeArg == 'mongodb.net') {
      this.serverMode = serverModeArg;
    } else {
      console.error("Something wrong with serverModeArg arg!")
      return;
    }

    console.info(" --------------------------------------------");
    console.info(" -> Server running under " + this.serverMode + " configuration.");
    if (this.serverMode == "dev") {
      console.info(" -> domain dev:", this.domain.dev);
    } else if (this.serverMode == "prod") {
      console.info(" -> domain prod:", this.domain.prod);
    }
    console.info(" -> protocol:", this.protocol);
    console.info(" -> databaseName:", this.databaseName);
    console.info(" --------------------------------------------");
  }

  /**
   * @description
   * Run admin host or not.
   */
  get hostAdminPanel() {
    return false;
  }

  /**
   * @description
   * Run web app host or not.
   */
  get ownHosting() {
    return true;
  }

  /**
   * @description
   * Keep it simple,
   * It is recommended to use standard ports.
   * [80, 443] to avoid cors and other problems.
   */
    get ownHttpHostPort() {
    return 80;
  }

  /**
   * @description
   * Run web app host www root folder.
   */
  get ownHostWWWfolder() {
    return "/frontend/web";
  }

  /**
   * @description
   * If you want to use api server with extra hosting,
   * You can integrate any web folders contents.
   */
  get hostSpecialRoute() {
    return {
      active: false,
      route: "/var/www/html/PATH_TO_WWW",
      webAppName: "RABBIT ADMIN PANEL",
      type: "admin",
      unsecured: true,
    }
  }

  /**
   * @description
   * Keep it simple,
   * It is recommended to use standard ports.
   * [80, 443] to avoid cors and other problems.
   */
  get apiPort() {
    return 8080;
  }

  /**
   * @description
   * Enable or disable console logs.
   */
  get deepLogs() {
    return true;
  }

  /**
   * @description
   * Domain name.
   */
  get domain() {
    return  {
      dev: "localhost",
      prod: "domain.com"
    };
  };

  /**
   * @description
   * Define http or https protocol.
   */
  get protocol() {
    return "http";
  }

  /**
   * @description
   * Very important on security level.
   */
  get maxRequestSize() {
    return "1mb";
  }

  // localhost
  get certPathSelf() {
    return {
      pKeyPath: "./self-cert/privatekey.pem",
      pCertPath: "./self-cert/certificate.pem",
      pCBPath: "./self-cert/certificate.pem"
    };
  };

  // production
  get certPathProd() {
    return {
      pKeyPath: "/etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem",
      pCertPath: "/etc/letsencrypt/live/YOUR_DOMAIN/cert.pem",
      pCBPath: "/etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem"
    };
  };

  /**
   * @description
   * Email Service
   */
  get systemEmail() {
    return {
      address: 'greespiral@gmail.com',
      pass: 'maximumroulette123654'
    };
  };

  /**
   * @description Database name
   * @param databaseName
   * @param databaseRoot {
   *   dev => LocalHost usage
   *   prod => Public Domain with possible remote connection
   *   secured => Public Domain with no possible remote connection
   * }
   */
  get databaseName() {
    return  "rabbit-base1";
  }

  get getDatabaseRoot() {
    const databaseRoot = {
      dev: "mongodb://localhost:27017",
      prod: "mongodb://userAdmin:PASSWORD@IP_ADDRESSS:27017/admin",
      freeService: "mongodb+srv://nikola:PASSWORD@cluster0.*.mongodb.net/rocket-1?retryWrites=true&w=majority"
    };
    if (this.serverMode == "dev") {
      return databaseRoot.dev;
    } else if (this.serverMode == "prod") {
      return databaseRoot.prod;
    } else if (this.serverMode == "mongodb.net") {
      return databaseRoot.freeService;
    }
  }

}

module.exports = ServerConfig;
