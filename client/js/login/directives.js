'use strict';

angular
	.module('app')
	.directive('loginForm', ['loginService', function(loginService){
		return {
			templateUrl: 'js/login/templates/login.html',
			controller: ['$scope', function($scope){

				var loginUser = loginService.getCurrentUser();
				$scope.currentUser = loginUser && loginUser.user;

				$scope.SignIn = function(){
					loginService.login('qwer@qwer.net', 'qwer', function () {
						var loginUser = loginService.getCurrentUser();
						$scope.currentUser = loginUser && loginUser.user;
					});
				};

				$scope.LogOut = function () {
					loginService.logout(function () {
						$scope.currentUser = null;
					});
				}

			}]
		};
	}]);