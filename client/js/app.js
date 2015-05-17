'use strict';

angular
  .module('app', [
    'lbServices',
    'ui.router',
    'LocalStorageModule',
    'asset'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('todo', {
        url: '/todo',
        templateUrl: 'js/todo/templates/todo.html',
        controller: 'TodoCtrl'
      }).state('login', {
        url: '/login',
        templateUrl: 'js/login/templates/login.html',
        controller: 'LoginCtrl'
      }).state('asset', {
        url: '/fixed-asset',
        templateUrl: 'js/asset/templates/asset.html',
        controller: 'AssetCtrl'
      });
    $urlRouterProvider.otherwise('todo');
  }])
  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('myApp')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
  }]);