angular.module('AYNY').factory('APIServices', function ($http, $rootScope) {
	var api = {};

  	/** 
     * Calling create api
     *  @return object
     */
	api.create = function(data) 
	{
	    return $http ({
		    method: 'post',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/create?"
		});
	};

	/** 
     * Calling login api
     * @return object
     */
	api.signIn = function(data) 
	{
		return $http ({
			method: 'post',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/login?"
		});
	};


	api.forgotPassword = function(emailid) 
	{
		return $http ({
			method: 'post',
			data : emailid,
			url: $rootScope.businessPartnerApiUrl+"/forgot?"
		});
	};

	api.changePassword = function(data) 
	{
		return $http ({
			method: 'put',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/changePassword/"+ data.token +"?"
		});
	};

	api.activationLinkResend = function(data) {
		return $http ({
			method: 'post',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/activationLinkResend?"
		});
	};

	api.resetPassword = function(data) {
		return $http ({
			method: 'put',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/resetPassword/"+ data.emailid +"?"
		});
	};

	/** 
     * Calling login api
     * @return object
     */
	api.validateEmailAndToken = function(data) 
	{
		return $http ({
			method: 'put',
			data : data,
			url: $rootScope.businessPartnerApiUrl+"/accountConfirmation?"
		});
	};
	return api;
});