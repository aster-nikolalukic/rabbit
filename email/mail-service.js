
// let config = require('../config');

/**
 * This class use shared lib.
 */
const shared = require("./../common/shared");

/**
 * @description Only objective for this class is
 * sending emails.
 */
class Sender {

  constructor(to, subject, content, config) {

    this.userId = shared.formatUserKeyLiteral(to);
    this.subject = subject;
    this.to = to;
    this.content = content;
    this.config = config;

  }

  async SEND(subject) {

    let arg = {
      user: this.config.systemEmail.address,
      pass: this.config.systemEmail.pass,
      to: this.to,
      subject: this.subject,
      html: this.content
    }

    new Promise((resolve, reject) => {
      this.GM = require("gmail-send")(arg);
      this.GM((
        subject
        // files: [filepath],
      ), function(err, res) {
        if (err != null) { reject(err); }
        resolve(res);
      });
    });

  }

}
module.exports = (to, subject, content, config) => { return new Sender(to, subject, content, config) }
