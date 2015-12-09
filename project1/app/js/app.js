
// For app initialization, configuration and routing
'use strict';
var app = angular.module('AYNY', ['ngRoute','toaster','ngMaterial','ngMessages']);
app.config(['$routeProvider',
		function ($routeProvider) {
			
			$routeProvider.
			when('/signup', {
				templateUrl : 'partial/signup.html',
				controller : 'signUpController'
			}).
			when('/signin', {
				templateUrl : 'partial/signin.html',
				controller : 'signInController'
			}).
			when('/home', {
				templateUrl : 'partial/home.html',
				controller : 'signInController'
			}).
			when('/forgot', {
				templateUrl : 'partial/forgotpassword.html',
				controller : 'forgotPasswordController'
			}).
			when('/confirmation', {
				templateUrl : 'partial/confirmation.html',
				controller : 'signUpController'
			}).
			when('/expiredlink', {
				templateUrl : 'partial/expiredlink.html',
				controller : 'signUpController'
			}).
			when('/changepassword', {
				templateUrl : 'partial/changepassword.html',
				controller : 'forgotPasswordController'
			}).
			when('/resetpassword', {
				templateUrl : 'partial/resetpassword.html',
				controller : 'resetPasswordController'
			}).
			when('/demo', {
				templateUrl : 'partial/panel_projects.html'
			})			.
			when('/', {
				templateUrl : 'partial/signin.html'
			}).
			when('/userprofile', {
				templateUrl : 'partial/pages_user_profile.html'
			}).
			otherwise({
				redirectTo : '/'
			});
		}
	]);