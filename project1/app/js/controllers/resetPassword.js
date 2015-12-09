var app = angular.module('AYNY');
app.controller('resetPasswordController', function($scope, $rootScope, $location, $route, $http, APIServices) {
  $rootScope.msg = null;
  /** 
  * Calling resetPassword function of services
  * @return nothing
  */
  $scope.resetPassword = function() {
		$rootScope.msg = null;
    $scope.emailid = localStorage.getItem('emailid'); 
    var resetUserPassword = APIServices.resetPassword({emailid : $scope.emailid, oldPassword : $scope.oldPwd
                                                          , password : $scope.nwPwd});
    resetUserPassword.success(function(data) {
        $rootScope.msg=data.ok_message.long_message;
        $("#resetPwdForm")[0].reset();
    }).error(function(data) {
        $scope.msg=data.errors[0].long_message;
        $("#resetPwdForm")[0].reset();
    });
  }   
});