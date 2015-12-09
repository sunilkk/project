
var passport = require('passport');
var bcrypt = require('bcryptjs');

module.exports = {
  /**
   * @method      index()
   * @description Admin can view all the registered user and their details
   * @return      {object} Shows user details in table
   */
  index: function(req, res) {
    Businesspartner.find(function foundUsers(err, users) {
      if (err) return next(err);
      res.view({
        users: users
      });
    });
  },

  view: function(req, res) {
    return res.json({
      todo: 'view() is not implemented yet!'
    });
  },

  /**
   * @api {post} Busnesspartner/create?additionalName=abc&emailid=abc@abc.com&birthDate=1991-02-04&gender=Male&password=Example@1 Sign Up
   * @apiName create
   * @apiGroup Businesspartner
   * @apiDescription User can register himself and can use sails-hub. Password will be inserted in JSON format.
   * @apiVersion 0.0.1
   * @apiParam {string} additionalName User name
   * @apiParam {date} birthDate User birthdate 
   * @apiParam {string} emailid User e-mail 
   * @apiParam {string} gender Male or Female
   * @apiParam {string} password User password
   * @apiParamExample {json} Request-Example
   *     {
   *       "additionalName": "Example",
   *       "birthDate": "1991-04-02",
   *       "emailid": "example@example.com",
   *       "gender": "Male",
   *       "password": "Example@1"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *      "ok_message": {
   *        "code": "200",
   *        "short_message": "Account pending for activation",
   *        "long_message": "Please check your e-mail to activate your account"
   *      }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "E_UNKNOWN",
   *          "long_message": "Duplicate Email Id"
   *        }]
   *     }
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "401",
   *          "short_message": "E_VALIDATION",
   *          "long_message": "Password Validation Failed.Should have minimum of 8 characters,
   *                           one number and 1 Upper case Letter"
   *        }]
   *     }
  */
  create: function(req, res, next) {
    Businesspartner.create({
      additionalName: req.param('name'),
      birthDate: req.param('birthDate'),
      emailid: req.param('emailid'),
      gender: req.param('gender')
    }, function businesspartnerUserCreated(err, user) {
      console.log(req.param('password'));
      if (err) {
        if (err.code == 'E_VALIDATION') {
          return res.serverError(err.code);
        }
        if (err.code == 'E_UNKNOWN') {
          return res.badRequest({
            "status": "Fail",
            "errors": [{
              "code": "400",
              "short_message": "E_UNKNOWN",
              "long_message": "Duplicate Email Id"
            }]
          }, 400);
        }
        return res.send(err);
      } else {
        var _id;
        if (user != undefined) {
          _id = user.id;
          User.create({
            password: req.param('password'),
            userId: _id,
            accountStatus: 'active',
            emailid: req.param('emailid')
          }, function userCreated(err, data) {
            if (err) {
              Businesspartner.destroy({
                emailid: req.param('emailid')
              }).exec(function userFind(err, Businesspartner) {
                if (err) {
                }
              });
              if (err.code == 'E_VALIDATION') {
                return res.badRequest({
                  "status": "Fail",
                  "errors": [{
                    "code": "401",
                    "short_message": "E_VALIDATION",
                    "long_message": "Password Validation Failed.Should have minimum of 8 characters,"+
                                    " one number and 1 Upper case Letter"
                  }]
                }, 401);
              }
            } else {
              TokenDetails.create({userId : data.id}, function (err, token) { 
                if(err) return res.json(err);
                var options = {
                  from: 'ayny@above-inc.com',  
                  to: user.emailid,
                  subject: 'AYNY-Account Activation',
                  template: 'activation',
                  // Require data for template  
                  userName: user.additionalName,
                  accountActivationLink: sails.config.hub.hostPath + 'app/#/confirmation?emailid='+user.emailid+'&token='+token.id
                };

                /* 
                 * Calling EmailService from service.js 
                 * Input for sendMail service is json object. Object must contain "from" and "to" element.
                 */
                EmailService.sendMail(options,function(err,response) {
                  if (err) {
                    return res.json(err);
                  } else {
                    return res.json({
                      "status": "OK",
                      "ok_message": {
                        "code": "200",
                        "short_message": "Account pending for activation",
                        "long_message": "Please check your e-mail to activate your account"
                      }
                    }, 200);
                  }
                });
              });
              /**  
               * Inside options object you can defind (from,to,subject,template,cc,bcc,html,text,data require for template).
               * Template available inside /views/templates/email directory.    
               */
            }
          });
        }
      }
    });
  },

  /**
   * @api {put} Busnesspartner/accountConfirmation?emailid=example@example.com&token=54ca31741e4fd46112cc1957 Account Confirmation
   * @apiName accountConfirmation
   * @apiGroup Businesspartner
   * @apiDescription After successful registration user will get a confirmation mail. User needs to click on the link he got.
   *                 And his account activated.
   * @apiVersion 0.0.1
   * @apiParam {string} emailid User e-mail
   * @apiParam {string} token Random ID
   * @apiParamExample {json} Request-Example
   *     {
   *       "emailid": "example@example.com",
   *       "token": "54ca31741e4fd46112cc1957"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *      "ok_message": {
   *        "code": "200", 
   *        "short_message": "Welcome to Hub",  
   *        "long_message": "Your account is activated successfully.
   *                         You can login to your account with your e-mailId as username and your password."
   *      }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "Parameter Mismatch",
   *          "long_message": ""
   *        }]
   *     }
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "Account Already activated",
   *          "long_message": "Your account is already active. Please click on the link for log in"
   *        }]
   *     }
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "Invalid link",
   *          "long_message": ""
   *        }]
   *     }
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "Invalid emailid",
   *          "long_message": ""
   *        }]
   *     }
   * @apiErrorExample {json} Error-Response
   *     {
   *        "status": "Fail",
   *        "errors": [{
   *          "code": "400",
   *          "short_message": "Update failed",
   *          "long_message": ""
   *        }]
   *     }
  */ 
  accountConfirmation: function(req, res) {
    if (!req.param('emailid') || !req.param('token')) {
      res.json({
        "status": "fail",
        "errors": [{
          "code": "400",
          "short_message": "Parameter Mismatch",
          "long_message": ""
        }]
      });
    } else {
      TokenDetails.find({id: req.param('token'), expirationTime : { '>': new Date()}})
      .exec(function findToken(err, tokenData) {
        if (err) {
          if(tokenData == undefined) {
            return res.json({
              "status": "fail",
              "errors": [{
              "code": "400",
              "short_message": "Invalid link",
              "long_message": ""
              }]
            });  
          }
        }
        if(tokenData.length == 0) {
          User.findOne({emailid : req.param('emailid')})
          .exec(function (err, user) {
            if(err) res.json(err);
            return res.json({
              "userId": user.id
            });  
          });
        } else {
          User.findOne({id : tokenData[0].userId})
          .exec(function (err, user) {
            if(err) {
              return res.json({
                "status": "fail",
                "errors": {
                  "code": "400",
                  "short_message": "Parameter Mismatch",
                  "long_message": ""
                }
              });
            } else {
              if(req.param('emailid') == user.emailid) {
                if(user.accountStatus == 'active') {
                  return res.json({
                    "status": "fail",
                    "ok_message": {
                    "code": "400",
                    "short_message": "Account Already activated",
                    "long_message": "Your account is already active. Please click on the link for log in."
                  }
                });    
              }
              User.update({emailid: user.emailid}, {accountStatus: 'active'})
              .exec(function userActivated(err, updated) {
              if (err) {
                return res.json({
                    "status": "fail",
                  "errors": [{
                    "code": "400",
                      "short_message": "Update failed",
                    "long_message": ""
                }]
                });
              } else {
                Businesspartner.findOne({id: updated[0].userId})
                .exec(function findUserName(err, businesspartner) {
                  if(err) {
                    return res.json({
                        "status": "fail",
                        "errors": [{
                        "code": "400",
                        "short_message": "User does not exist",
                      "long_message": ""
                    }]
                  }); 
                  } else {
                  var options = {
                      from: 'ayny@above-inc.com',
                      to: businesspartner.emailid,
                      subject: 'Welcome',
                      // Template name is defind here    
                      template : 'welcome',
                      // Require data for template
                      userName : businesspartner.additionalName,
                      link : sails.config.hub.hostPath+'app/#/'
                    };

                    // Calling EmailService from service.js 
                  EmailService.sendMail(options,function(err,response) {
                      if (err) {
                      return res.json(err);
                    } else {
                      return res.json({
                        "status": "OK",
                        "ok_message": {
                          "code": "200", 
                          "short_message": "Welcome to AYNY",  
                          "long_message": "Your account is activated successfully."+ 
                                          "You can login to your account with your e-mailId as username and your password."
                        }
                      });
                    }
                  });
                  } 
                });
              }
            });
            } else {
              return res.json({
              "status": "fail",
              "errors": [{
                "code": "400", 
                "short_message": "Invalid EmailId",  
                "long_message": ""
              }]
            });
              }
            }
          });
        }
      }); 
    }
  },

  /**
   * @api {post} Busnesspartner/login?emailid=example@example.com&password=Example@1 Sign In
   * @apiName login
   * @apiGroup Businesspartner
   * @apiDescription After activation user can login to his account 
   *                 
   * @apiVersion 0.0.1
   * @apiParam {string} emailid User e-mail
   * @apiParam {string} password User password
   * @apiParamExample {json} Request-Example
   *     {
   *       "emailid": "example@example.com",
   *       "password": "Example@1"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Login Success",
   *         "long_message": "
   *       }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "400", 
   *        "short_message":"Invalid EmailId", 
   *        "long_message":""
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"Invalid Password", 
   *        "long_message":"
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "402", 
   *        "short_message":"Account Disabled", 
   *        "long_message":"Plesae activate your account through the email sent to you"
   *      }]
   *   }
  */  
  login: function(req, res) {
    res.view();
  },

  loginPassportLocal: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {

        if(info.errors[0].noOfWrongAttempts == null || info.errors[0].noOfWrongAttempts == undefined) {
            info.errors[0].noOfWrongAttempts = 0;
        }

        if(info.errors[0].noOfWrongAttempts == sails.config.hub.numberOfWrongAttempt) {
           User.find({emailid : info.errors[0].emailid,accountStatus : 'locked'},function(err,statusChanged) {
            if(statusChanged) sails.controllers.businesspartner.forgot(req,res);
          });
        } 

        else {
          info.errors[0].noOfWrongAttempts = info.errors[0].noOfWrongAttempts + 1;
        }
        
        if(info.errors[0].noOfWrongAttempts == sails.config.hub.numberOfWrongAttempt) {
          User.update({emailid : info.errors[0].emailid},{numberOfWrongAttempt : info.errors[0].noOfWrongAttempts, accountStatus : 'locked'},function(err,numberOfWrongAttempt) {              
          });
        }

        else {
          User.update({emailid : info.errors[0].emailid},{numberOfWrongAttempt : info.errors[0].noOfWrongAttempts},function(err,numberOfWrongAttempt) {             
          });
        }

        return res.badRequest(info);
      }

      else {

        User.update({emailid : user.emailid},{numberOfWrongAttempt : 0},function(err,success){
        });

          var duration =Math.ceil((user.passwordExpirationTime-user.updatedAt)/(24*60*60*1000));
            if(duration == 0) {
              return res.json({
                "status": "OK",
                "duration": "Password is expired."
              });
            }
      }

      req.logIn(user, function(err) {
        if (err) {
          return res.json({
            status: 'Login Failed '
          }, 300);
        }

        if(duration <= 5 && duration >=1) {
         return res.json({
           "status": "OK",
           "duration": "Password will expire in "+duration+" days. Please reset your password by clicking on change password link."
         });
       } 

        return res.json({
          status: 'OK '
        }, 200);
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
  },

  /**
   * @api {post} Busnesspartner/forgot?emailid=example@example.com Forgot Password
   * @apiName forgot
   * @apiGroup Businesspartner
   * @apiDescription If user forgets his password
   * @apiVersion 0.0.1
   * @apiParam {string} emailid User registered e-mailid
   * @apiParamExample {json} Request-Example
   *     {
   *       "emailid": "example@example.com"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Your token has been expired. Please request again."
   *       }
   *   }
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Change password link send to register Emailid."
   *       }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"User does not exist", 
   *        "long_message": ""
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"Update failed", 
   *        "long_message": ""
   *      }]
   *   }
  */ 
  forgot: function(req, res) {
    User.findOne({emailid : req.param('emailid')},function (err, user) {
      if (err) {
        return res.json(err);
      };
     
      if(user){
        TokenDetails.findOrCreate({userId : user.userId, expirationTime : { '>': new Date()}},
        {userId : user.userId}, function (err, token) {
          if(err) return res.json(err);
          if(token.length == undefined){
            if(token.isExpired == true){ 
              TokenDetails.update({userId : user.userId},{isExpired : false},
              function (err, updatedToken) {
                if(err) return res.json(err);
                token = updatedToken;
              });
            }
          }else{
            token =token[0];
          }
          var options = {
            from: 'ayny@above-inc.com',
            to: req.param('emailid'),
            subject: 'forgot password link',
            html : sails.config.hub.hostPath+'app/#/changepassword?emailid='+user.emailid+'&token='+token.id
          };
          EmailService.sendMail(options,function(err,response) {});
          return res.json({
            "status": "OK",
            "ok_message": {
              "code": "200", 
              "short_message": "Change password link send to register Emailid."  
            }
          }, 200);
        });
      } else {
        res.json({
            "status": "404",
            "ok_message": {
              "code": "200", 
              "short_message": "Emailid doesn't exist."  
            }
          }, 200);
      }
    });
  },

  /**
   * @api {put} Busnesspartner/changePassword?emailid=example@example.com&password=Example@1&token=54d9854a34487dab0c8ab90g Change Password
   * @apiName changePassword
   * @apiGroup Businesspartner
   * @apiDescription If user forgets his password and he wants to reset his password
   * @apiVersion 0.0.1
   * @apiParam {string} emailid User registered e-mailid
   * @apiParam {string} password User new password
   * @apiParam {string} token Random string
   * @apiParamExample {json} Request-Example
   *     {
   *       "emailid": "example@example.com",
   *       "password": "Example@1",
   *       "token": "54d9854a34487dab0c8ab90g"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Your token has been expired. Please request again."
   *       }
   *   }
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Password changed successfully."
   *       }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"User does not exist", 
   *        "long_message": ""
   *      }]
   *   }
  */ 
  changePassword: function(req, res) {
    var currentDate = new Date();
    TokenDetails.find({id : req.param('token'),expirationTime : { '>': new Date()},isExpired : false},
      function(err,token){
      if(err){
        return next(err);
      }else{
        if(token.length == 0){
          return res.json({
            "status": "OK",
            "ok_message": {
            "code": "200", 
            "long_message": "Your token has been expired. Please request again."  
            }
          }, 200);
        }else{
          User.update({emailid : req.param('emailid')},{password : req.param('password'), accountStatus: 'active'}
          ,function(err,user){
            if(err){
              return next(err);
            }
            TokenDetails.update({id : token[0].id},{isExpired : true},function(err,token){
            });
            return res.json({
              "status": "OK",
              "ok_message": {
              "code": "200", 
              "long_message": "Password changed successfully."  
              }
            }, 200);
          });
        }
      }
    });
  },

  /**
   * @api {post} Busnesspartner/activationLinkResend?userId=54d9854a34487dab0c8ab90e Resending Account Activation Link
   * @apiName activationLinkResend
   * @apiGroup Businesspartner
   * @apiDescription If user did not activate his account and link expired and user will get new link
   * @apiVersion 0.0.1
   * @apiParam {string} userId Id Generated by Businesspartner 
   * @apiParamExample {json} Request-Example
   *     {
   *       "userId": "54d9854a34487dab0c8ab90e"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Account pending for activation",
   *         "long_message": "Please check your e-mail to activate your account"
   *       }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "400", 
   *        "short_message":"Creation failed", 
   *        "long_message": ""
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"User does not exist", 
   *        "long_message": ""
   *      }]
   *   }
  */  
  activationLinkResend: function(req, res) {
    TokenDetails.findOrCreate({ userId: req.param('userId'), expirationTime : { '>': new Date()}},
      {userId: req.param('userId')} ,function tokenDetailsCreated(err, tokenData) {
      if(err) {
        return res.badRequest({
          "status": "Fail",
          "errors": [{
            "code": "401",
            "short_message": "Creation failed",
            "long_message": ""
          }]
        }, 401);
      } else {
        User.findOne({id: req.param('userId')}).
        exec(function(err,user){
          if(err){
            return res.json(err);
          }
          emailid=user.emailid;
          Businesspartner.findOne({id: user.userId})
            .exec(function findUserName(err, businesspartner) {
            if(err) return res.json(err);
            var options = {
              from: 'ayny@above-inc.com',  
              to: emailid,
              subject: 'AYNY-Account Activation',
              template: 'activation',
              // Require data for template  
              userName: businesspartner.additionalName,
              accountActivationLink: sails.config.hub.hostPath + 'app/#/confirmation?emailid='+emailid+'&token='+tokenData.id
            };
            /* 
             * Calling EmailService from service.js 
             * Input for sendMail service is json object. Object must contain "from" and "to" element.
            */
            EmailService.sendMail(options,function(err,response) {
              if (err) {
                return res.json(err);
              } else {
                return res.json({
                  "status": "OK",
                  "ok_message": {
                    "code": "200",
                    "short_message": "Account pending for activation",
                    "long_message": "Please check your e-mail to activate your account"
                  }
                }, 200);
              }
            });
          });
        });
      }
    });  
  },

  /**
   * @api {put} Busnesspartner/resetPassword?emailid=example@example.com&oldPassword=Example@1&newPassword=Example@2 Reset Password
   * @apiName resetPassword
   * @apiGroup Businesspartner
   * @apiDescription If user wants to change his password
   *                 
   * @apiVersion 0.0.1
   * @apiParam {string} emailid User e-mail
   * @apiParam {string} oldPassword User current password
   * @apiParam {string} newPassword User new password
   * @apiParamExample {json} Request-Example
   *     {
   *       "emailid": "example@example.com",
   *       "oldPassword": "Example@1",
   *       "newPassword": "Example@2"
   *     }
   * @apiSuccess {object} Json Json format
   * @apiSuccessExample {json} Success-Response
   *   {
   *      "status": "OK",
   *       "ok_message": {
   *         "code": "200",
   *         "short_message": "Your passwosd has been changed",
   *         "long_message": ""
   *       }
   *   }
   * @apiError {object} Json Json format
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "400", 
   *        "short_message":"User does not exist", 
   *        "long_message": ""
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "401", 
   *        "short_message":"Invalid Password", 
   *        "long_message": "You entered invalid password"
   *      }]
   *   }
   * @apiErrorExample {json} Error-Response
   *   {
   *      "status": "Fail",
   *      "errors": [{
   *        "code": "402", 
   *        "short_message":"Updatation failed", 
   *        "long_message":""
   *      }]
   *   }
  */  
  resetPassword: function(req, res) {
    User.findOne({ emailid: req.param('emailid')},function (err, user) {
      if (err) { 
        return res.json({
          "status": "Fail",
          "errors": [{
            "code": "400", 
            "short_message":"User does not exist", 
            "long_message":""
          }]
        });
      } else {
        bcrypt.compare(req.param('oldPassword'), user.password, function(err,valid) {
          if(!valid) {
            return res.badRequest({
              "status": "Fail",
              "errors": [{
                "code": "400", 
                "short_message":"Invalid Password", 
                "long_message":"You entered invalid password"
              }]
            });
          } else {
            User.update({emailid: user.emailid}, {password: req.param('password')})
              .exec(function passwordUpdated(err, updated) {
              if(updated) {
                return res.json({
                  "status": "OK",
                  "ok_message": {
                    "code": "200",
                    "short_message": "Password updated",
                    "long_message": "Your password has been changed"
                  }
                });
              } else {
                return res.json({
                  "status": "Fail",
                  "errors": [{
                    "code": "400",
                    "short_message": "Updatation failed",
                    "long_message": "Updatation failed"
                  }]
                });  
              }
            });
           } 
         });
       }
    });  
  }
};

