var app = angular.module('AYNY');

app.controller('signUpController', ['$scope', 'APIServices', '$rootScope' ,'$location','toaster', function ($scope, APIServices, $rootScope, $location,toaster ) {

	  $scope.day = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
		  $scope.month = [
						    { id : '01', name:'Jan' },
						    { id : '02', name:'Feb' },
						    { id : '03', name:'Mar' },
						    { id : '04', name:'Apr' },
						    { id : '05', name:'May' },
						    { id : '06', name:'Jun' },
						    { id : '07', name:'Jul' },
						    { id : '08', name:'Aug' },
						    { id : '09', name:'Sept'},
						    { id : '10', name:'Oct' },
						    { id : '11', name:'Nov' },
						    { id : '12', name:'Dec' }
		  				 ];    
		  $scope.year = [];
		  for(var i = 1950; i <= 2015; i++){
		    $scope.year.push(i);
		  }

		  $scope.changeDate=function(){
		    $scope.errorMsg="";  
		    if($scope.Month=="02"){
		      if($scope.Day =='30' || $scope.Day =='31'){
		        $scope.errorMsg="Day must be less or equal to 29"
		      }
		    }
		  } 

		  /** 
		  * Calling create user function
		  * @return nothing
		  */
		  $scope.create = function() {  
		  
		    $rootScope.msg = null;
		    var day = $scope.Day ;
		    if($scope.Day < 10){
		      day="0"+$scope.Day;
		    }
		   
		   var data = {name : $scope.name , emailid : $scope.email, gender : $scope.gender,password : $scope.password, 
		                  birthDate : $scope.Year + "-" + $scope.Month + "-" + day + "T00:00:00"};   
		    console.log(data);
			//console.log($scope.Month);
		    var createUser = APIServices.create(data);
		    createUser.success(function(data) {
		      $rootScope.msg=data.ok_message.long_message;
		      $('#signupForm')[0].reset();
		      //alert("successfull create your account Please activate your account");
		      toaster.pop('success',"successfull create your account Please activate your account");
		      $location.path("/signin");
		    }).error(function(data) {
		    	//alert("status : "+data.status+" , Error : "+data.errors[0].long_message);
		      toaster.pop('error',"Error : "+data.errors[0].long_message);
		      $rootScope.msg=data.errors[0].long_message;
		      $('#signupForm')[0].reset();
		      $location.path("/signup");
		    });
		  }  
 
		    /** 
		     * Calling validateEmailAndToken function of services
		     * @return nothing
		     */
		  $scope.validateEmailAndToken = function() { 
		    $rootScope.msg = null;
		    /** 
		    * Retrive data from url
		    * @return same retrived data
		    */
		    $scope.getUrlVars = function() {
		      var vars = {};
		      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		        vars[key] = value;
		      });
		      return vars;
		    }

		    var email = $scope.getUrlVars()["emailid"];
		    var token = $scope.getUrlVars()["token"];
		    var validateEmailAndToken = APIServices.validateEmailAndToken({emailid : email, token : token});

		    validateEmailAndToken.success(function(data) {
		      $rootScope.userId = data.userId;
		      if(data.userId != undefined){
		        $location.path("/userprofile");
		      }else
		        $rootScope.msg=data.ok_message.long_message;
		    }).error(function(data) {
		      // if (data.errors[0].short_message == 'Invalid Token or EmailId') {
		      //     $rootScope.msg=data.errors[0].short_message;
		      // }
		    });
		  } 
		  $scope.activationLinkResend = function() { 
			    $rootScope.msg = null;
			    var userId = $rootScope.userId;
			    var linkResend = APIServices.activationLinkResend({userId : userId});

			    linkResend.success(function(data) {
			      $location.path('/');
			    }).error(function(data) {  
			    });
		   }  
	 }//signUpController END
]);