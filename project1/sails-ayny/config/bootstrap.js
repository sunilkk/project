/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  	PasswordDetails.find().exec(function(err,password){
  		if(password.length != 0){
  			password = password[0];
	  		sails.config.hubpassword.type = password.type;
	   		sails.config.hubpassword.required = password.required;
	   		sails.config.hubpassword.minLength = password.minLength;
	   		sails.config.hubpassword.maxLength = password.maxLength;
	   		sails.config.hubpassword.hasUpperCase = password.hasUpperCase;
	   		sails.config.hubpassword.hasLowerCase = password.hasLowerCase;
	   		sails.config.hubpassword.hasNumber = password.hasNumber;
	   		sails.config.hubpassword.hasSpecialChar = password.hasSpecialChar;
	   		
   		}
  	});

  	setInterval(function() {  
	    TokenDetails.destroy({expirationTime : { '<': new Date()}},function(err,token){
	      if(err)
	      console.log(err);
	  	});
	}, 12*60*60*1000);

  cb();
};
