var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOneById(id).exec(function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'emailid',
  passwordField: 'password'
}, function(emailid, password, done) {
  User.findOne({ emailid: emailid},function userfindPassword(err, user) {
    if (err) { 
    }
    if (!user) { 
      return done(null, false, {
        "status": "Fail",
        "errors": [{
          "code": "400", 
          "short_message":"Invalid EmailId", 
          "long_message":""
        }]
      }); 
    }
    bcrypt.compare(password, user.password, function(err,valid) {
      if(!valid) {
        return done(null, false, {
          "status": "Fail",
          "errors": [{
            "code": "400", 
            "short_message":"Invalid Password", 
            "long_message":"",
            "emailid" : user.emailid,
            "noOfWrongAttempts" : user.numberOfWrongAttempt,
            "accountStatus" : user.accountStatus
          }]
        });
      } else {
        if(user.accountStatus== 'inactive') {
          return done(null, false, {
            "status": "Fail",
            "errors": [{
              "code": "400", 
              "short_message":"Account Disabled", 
              "long_message":"Plesae activate your account through the email sent to you"
            }]
          }); 
        } 

        if(user.accountStatus== 'locked') {
          return done(null, false, {
            "status": "Fail",
            "errors": [{
            "code": "400", 
            "short_message":"Account Locked", 
            "long_message":"Your Account is Disabled.Plesae Check your Email to activate your account",
            }]
          }); 
        }
      
        else  {
          return done(null, user);
        }        
      }
    });            
  });
})); 