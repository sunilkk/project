var app = angular.module('AYNY');
app.controller('forgotPasswordController', function($scope, $rootScope, $location, $route, $http, APIServices,toaster) {

  /** 
  * Calling signOut function of services
  * @return nothing
  */
  $scope.forgotPassword = function() {
    var emailid=$scope.email;
    var forgotPassword = APIServices.forgotPassword({emailid : emailid});
    forgotPassword.success(function(data) {
      //alert(data.ok_message.short_message);
      toaster.pop('info',data.ok_message.short_message);
      $location.path("/");
    }).error(function(data) {
     
    });
  }

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

    $scope.changePassword = function() {
      var password=$scope.password;
      var changePassword = APIServices.changePassword({emailid : email, password : password, token : token});
      changePassword.success(function(data) {
        //alert(data.ok_message.long_message);
        toaster.pop('success',data.ok_message.long_message);
        $location.path("/");
      }).error(function(error) {

        $location.path("/");
      });
    }
  }
});