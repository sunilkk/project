var app = angular.module('AYNY');

app.controller('signInController', ['$scope', 'APIServices', '$rootScope','$location','toaster', function ($scope, APIServices, $rootScope, $location,toaster) {
		$rootScope.msg = null;
		$scope.email= localStorage.getItem('emailid');
		  /** 
		  * Calling signIn function of services
		  * @return nothing
		  */
  		 $scope.signIn = function() {
		    var loginUser = APIServices.signIn({emailid : $scope.email, password : $scope.password});
		    loginUser.success(function(data) {
			console.log(data);
		    $scope.emailid = localStorage.setItem('emailid',$scope.email);
		    if(data.duration == 'Password is expired.') {
		    	//alert("Password is expired.Please reset your password");
		    	toaster.pop('warning',"Password is expired.Please reset your password")
		        $location.path('/userprofile');
		      } else {
		        $rootScope.notification=data.duration;
						
		        $location.path("/userprofile");
		      }
		    }).error(function(data) {
		    	//alert("Stasus : "+data.status+" ,Error : "+data.errors[0].short_message+" Attempts : "+data.errors[0].noOfWrongAttempts);
				toaster.pop('error',"Error : "+data.errors[0].short_message);

		       $rootScope.msg=data.errors[0].long_message;
		        $location.path("/userprofile");
		    });
	     } 
	}//signInController END
]);
app.controller('AppCtrl',['$scope',function (){
	this.userState = '';
        this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
}]);
