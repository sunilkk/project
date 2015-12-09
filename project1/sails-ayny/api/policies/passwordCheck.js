module.exports = function(req, res, next) {

	var password = req.param("password");
	var type = sails.config.hubpassword.type;
	var required = sails.config.hubpassword.required; 
	var minLength = sails.config.hubpassword.minLength;
	var maxLength = sails.config.hubpassword.maxLength;
	var hasUpperCase = sails.config.hubpassword.hasUpperCase;
	var hasLowerCase = sails.config.hubpassword.hasLowerCase;
	var hasNumber = sails.config.hubpassword.hasNumber;
	var hasSpecialChar = sails.config.hubpassword.hasSpecialChar;

	var error ={
        "status": "Fail",
        "errors": [{
            "code": "400",
            "short_message": "E_VALIDATION"
        }]
    };

	if(password == undefined && required){
		error.long_message ="Password is required.";
		return res.badRequest(error, 400);
	}else{
		if (type != typeof(password)) {
			error.long_message ="Password type is " + type ;
			return res.badRequest(error, 400);
		}else{
			if(password.length < minLength || password.length >maxLength){
				error.long_message ="Password is length in between "+ minLength +" and " + maxLength;
				return res.badRequest(error, 400);
			}else{
				if(hasUpperCase && password.search(/[A-Z]/) == -1){
					error.long_message ="Password must contain one uppercase character.";
					return res.badRequest(error, 400);
				}else{
					if(hasLowerCase && password.search(/[a-z]/) == -1){
						error.long_message ="Password must contain one lowercase character.";
						return res.badRequest(error, 400);
					}else{
						if(hasNumber && password.search(/[0-9]/) == -1){
							error.long_message ="Password must contain one number.";
							return res.badRequest(error, 400);
						}else{
							if(hasSpecialChar && password.search(/[~!@#$%^&*]/) == -1){
								error.long_message ="Password must contain one special character.";
								return res.badRequest(error, 400);
							}
							else
								next();
						}	
					}
				}
			}
		}
	}
}