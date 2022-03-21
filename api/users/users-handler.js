
class ResponseHandler {

  constructor(crypto) {
    this.crypto = crypto;
  }

  async getUsersResponse(req, res) {

    console.info("Func: getUsersResponse Route: /rocket/users , With body => ", req.body);

    if(typeof req.body.token !== 'undefined') {

      var user = {
        token: req.body.token,
        size: 200,
        i: 1,
        criterium: req.body.criterium
      };

      var responseFlag = await this.dataAction.getUsersList(user, this);

      if(responseFlag.status == "AUTHORIZED") {
        res.status(200).json({
          message: "get users response",
          rabbitStatus: responseFlag.status,
          users: responseFlag.users
        });
      } else {
        res.status(400).json({
          message: "NO AUTHORIZED",
          rabbitStatus: "bad request"
        });
      }
    } else {

      res.status(401).json({
        message: "There is no exspected props in request body.",
        rabbitStatus: "bad request"
      });
      return;
    }
  }

}

module.exports = ResponseHandler
