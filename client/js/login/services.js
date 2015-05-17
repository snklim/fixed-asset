'use strict';

angular
	.module('app')
	.service('loginService', ['User', 'localStorageService', function (User, localStorageService) {

		var getCurrentUser = function () {
			return localStorageService.get('loginUser');
		};

		var login = function (email, password, cb) {

			User.login({email:email, password:password}, function(loginUser){

				localStorageService.set('loginUser', loginUser);
				cb();

			}, function(err){
				console.log(err);
			});

		};

		var logout = function (cb) {
			var loginUser = getCurrentUser();

			if(loginUser){
				User.logout(loginUser, function () {
					localStorageService.remove('loginUser');
					cb();
				}, function (argument) {
					localStorageService.remove('loginUser');
					cb();
				})
			}
		}

		return {
			login: login,
			logout: logout,
			getCurrentUser: getCurrentUser
		};
	}]);