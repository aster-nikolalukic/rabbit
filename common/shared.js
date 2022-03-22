module.exports = {
  resolveURL: function(url) {
    const isWin = !!process.platform.match(/^win/);
    if (!isWin) {
      return url;
    }
    return url.replace(/\//g, "\\");
  },

  validateEmail: function(email) {
    // tslint:disable-next-line:max-line-length
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regexp.test(email) === false) {
      return "Email is not valid !";
    }
    return null;
  },

  validatePassword: function(pass) {
    if (pass.length < 8) {
      return false;
    }
    return true;
  },

  myBase: {},

  generateToken: function(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  formatUserKeyLiteral(userEmail) {
    let local = userEmail;
    local = local.replace("@", "_alpha_");
    let encoded = Buffer.from(local).toString("base64");
    encoded = encoded.replace(/=/g, "ab");
    return encoded;
  },

  getDefaultNickName() {
    return Math.random().toFixed(0);
  },

  getRandomIntFromTo(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getDebbugerColorText() {
  var Reset = "\x1b[0m",
      Bright = "\x1b[1m",
      Dim = "\x1b[2m",
      Underscore = "\x1b[4m",
      Blink = "\x1b[5m",
      Reverse = "\x1b[7m",
      Hidden = "\x1b[8m",
      FgBlack = "\x1b[30m",
      FgRed = "\x1b[31m",
      FgGreen = "\x1b[32m",
      FgYellow = "\x1b[33m",
      FgBlue = "\x1b[34m",
      FgMagenta = "\x1b[35m",
      FgCyan = "\x1b[36m",
      FgWhite = "\x1b[37m",
      BgBlack = "\x1b[40m",
      BgRed = "\x1b[41m",
      BgGreen = "\x1b[42m",
      BgYellow = "\x1b[43m",
      BgBlue = "\x1b[44m",
      BgMagenta = "\x1b[45m",
      BgCyan = "\x1b[46m",
      BgWhite = "\x1b[47m";
  }
};
