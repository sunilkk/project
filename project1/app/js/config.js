angular.module('AYNY').run(function ($rootScope, $location) {

	HUB_API_HOST = 'localhost';
	HUB_API_PORT = 1337;
	HUB_API_URL = 'http://'+HUB_API_HOST+':'+HUB_API_PORT;

	HUB_APP_HOST='localhost';
	HUB_APP_URL = 'http://'+HUB_APP_HOST+'/project1/app/';

	$rootScope.businessPartnerApiUrl = HUB_API_URL + '/Businesspartner';

	$rootScope.home = HUB_APP_URL;

});