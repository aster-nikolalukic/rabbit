class ResponseHandler {
  constructor(crypto, config) {
    this.crypto = crypto;
    this.config = config;
  }

  async onRegisterResponse(req, res) {
    console.log("/rocket/register ", req.body.emailField);
    if (
      (typeof req.body.data.userRegData.email !== "undefined") &
      (typeof req.body.data.userRegData.password !== "undefined")
    ) {
      var user = {
        email: req.body.data.userRegData.email,
        password: req.body.data.userRegData.password,
      };

      // check email validation

      var responseFlag = await this.dataAction.register(user, this);
      console.log("/rocket/register responseFlag ", responseFlag);
      if (responseFlag.status == "USER_ALREADY_REGISTERED") {
        res.status(200).json({
          message: "You are already registred.",
          rabbitStatus: responseFlag.status,
        });
      } else if (responseFlag.status == "USER_REGISTERED") {
        let emailRegBody =
          require("./../../email/templates/confirmation.html").getConfirmationEmail;
        let contentRegBody = emailRegBody(
          responseFlag.token,
          responseFlag.email
        );
        let emailConnection = null;

        try {
          emailConnection = require("./../../email/mail-service")(
            responseFlag.email,
            responseFlag.status,
            contentRegBody,
            this.config
          ).SEND(responseFlag.email);
        } catch (error) {
          console.warn("Connector error in sending reg email!", error);
          console.log("Email reg error. Notify client.");
        } finally {
          emailConnection
            .then(data => {
              res.status(200).json({
                message: "Check email for conmfirmation key.",
                rabbitStatus: "USER_REGISTERED",
                email: responseFlag.email,
              });
              console.log("Email reg sended. Notify client.");
            })
            .catch(error => {
              console.log("Error in sending email procedure: " + error);
              res.status(201).json({
                message: "Check email for conmfirmation key.",
                rabbitStatus: "USER_REGISTERED",
              });
            });
        }
      }
    } else {
      console.log("/rocket/register There is no exspected props in request body.");

      res.status(400).json({
        message: "There is no exspected props in request body.",
        rabbitStatus: "bad request",
      });
      return;
    }
  }

  async onRegValidationResponse(req, res) {
    var user = {
      email: req.body.data.userRegData.email,
      token: req.body.data.userRegData.code,
    };

    var responseFlag = await this.dataAction.regValidator(user);
    // console.log("/rocket/confirmation responseFlag ", responseFlag);

    if (responseFlag.result !== null) {
      // console.log("/rocket/confirmation passed ", responseFlag.email);
      res.status(200).json({
        message: "Confirmation done.",
        rabbitStatus: "USER_CONFIRMED",
        accessToken: responseFlag.token,
      });
    } else {
      res.status(202).json({
        message: "Wrong confirmation code.",
        rabbitStatus: "USER_NOT_CONFIRMED",
      });
    }
  }

  async onLoginResponse(req, res) {
    if (req.secure) {
      console.log("Secured.");
    }

    console.log("/rabbit/login ", req.body);
    if ((typeof req.body.data.userLoginData.email !== "undefined") &
      (typeof req.body.data.userLoginData.password !== "undefined")) {

      var user = {
        email: req.body.data.userLoginData.email,
        password: req.body.data.userLoginData.password,
      };

      var responseFlag = await this.dataAction.loginUser(user, this);
      console.log("/rabbit/login => ", responseFlag);
      if (responseFlag.status == "USER_LOGGED") {
        res.status(200).json({
          message: "User logged",
          rabbitStatus: responseFlag.status,
          flag: responseFlag,
        });
      } else {
        res.status(300).json({
          message: "Wrong Password, wrong email or any other case.",
          rabbitStatus: "no-session",
        });
      }
    } else {
      res.status(404).json({
        message: "Waoou vauu",
        rabbitStatus: "no-session",
      });
    }
  }

  async onForgotNewPassworkResponse(req, res) {
    var user = {
      email: req.body.emailField,
      token: req.body.tokenField,
    };

    var responseFlag = await this.dataAction.forgotPass(user, this);
    console.log("/rabbit/forgotPass responseFlag ", responseFlag);

    if (responseFlag.status == "FTOKEN CREATED") {
      let emailFPassBody =
        require("./../../email/templates/confirmation.forgotpass.html").getConfirmationForgotPass;
      let contentRegBody = emailFPassBody(responseFlag.ftoken, user.email);

      var emailConnection = require("./../../email/mail-service")(
        responseFlag.email,
        responseFlag.status,
        contentRegBody,
        this.config
      ).SEND(responseFlag.email);

      emailConnection.then(checkEmailService => {
        console.log("CATCH WHAT IS THAT ", checkEmailService);
        if (checkEmailService.toString().indexOf("OK")) {
          console.log("NICE NICE");
          res.status(200).json({
            message: "Please check your email for confirmation code.",
            rabbitStatus: "CHECK_EMAIL_FORGOT_PASSWORD_CODE",
            accessToken: responseFlag.email,
          });
        }
      });
      emailConnection.catch(checkEmailService => {
        console.log("CATCH WHAT IS THAT ", checkEmailService);
        res.status(200).json({
          message:
            "Please check your email for confirmation code. If you dont get email for 5 minute try again.",
          rabbitStatus: "CHECK_EMAIL_FORGOT_PASSWORD_CODE",
          accessToken: responseFlag.token,
        });
      });
    } else {
      res.status(202).json({
        message: "Something wrong here, man.",
        rabbitStatus: responseFlag.status,
      });
    }
  }

  async onSetNewPassworkResponse(req, res) {

    var user = {
      email: req.body.emailField,
      ftoken: req.body.ftoken,
      newPassword: req.body.newPassword,
    };

    var responseFlag = await this.dataAction.setNewPass(user, this);
    // console.log("/rabbit/forgotPass responseFlag ", responseFlag);
    if (responseFlag.status == "NEW-PASS-DONE") {
      console.log("NEW PASS DONE");
        console.log("NICE NICE");
        res.status(200).json({
          message: "You setup new password for your [rabbit] account.",
          rabbitStatus: "NEW_PASSWORD_DONE",
          accessToken: responseFlag.email,
        });
    } else {
      res.status(202).json({
        message: "Something wrong here, man.",
        rabbitStatus: responseFlag.status,
      });
    }
  }
}

module.exports = ResponseHandler;
