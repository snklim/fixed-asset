'use strict';

var asset = angular.module('asset');

asset.controller('AssetCtrl', ['$scope', 'periodsService', 'depreciationService', 'purchasesService', 'lifetimeService', 'fixedAssetService',
	function ($scope, periodsService, depreciationService, purchasesService, lifetimeService, fixedAssetService) {

	$scope.purchasePrice = 225;
	$scope.purchasePeriodYear = 2015;
	$scope.purchasePeriodNumber = 1;
	$scope.assetLifetime = 20;

	$scope.startPeriodYear = 2015;
	$scope.startPeriodNumber = 1;

	$scope.systemPeriods = periodsService.getSystemPeriods();
	$scope.purchases = purchasesService.getPurchases();
	$scope.lifetimeRegimes = lifetimeService.getLifetimeRegimes();

	$scope.addPeriod = function () {
		$scope.systemPeriods = periodsService.addPeriod({
			year: $scope.periodYear,
			number: $scope.periodNumber
		});

		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.removePeriod = function (period) {
		$scope.systemPeriods = periodsService.removePeriod(period);
		
		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.addLifetime = function () {
		$scope.lifetimeRegimes = lifetimeService.addLifetime({
			period: {year: $scope.lifetimePeriodYear, number: $scope.lifetimePeriodNumber},
			lifetime: $scope.assetLifetime,
			stopvalue: $scope.lifetimeStopValue,
			remainedvalue: $scope.lifetimeRemainedValue
		});

		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.removeRegime = function (regime) {
		$scope.lifetimeRegimes = lifetimeService.removeLifetime(regime);

		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.addPurchase = function () {
		$scope.purchases = purchasesService.addPurchase({price:$scope.purchasePrice,period:{year: $scope.purchasePeriodYear, number: $scope.purchasePeriodNumber}});

		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.removePurchase = function (purchase) {
		$scope.purchases = purchasesService.removePurchase(purchase);

		$scope.periods = depreciationService.depreciatePurchases({year: $scope.startPeriodYear, number: $scope.startPeriodNumber});
	}

	$scope.updateFixedAsset = function () {
		fixedAssetService.setStartPeriod({year: $scope.startPeriodYear, number: $scope.startPeriodNumber});

		$scope.periods = depreciationService.depreciatePurchases();
	}

	$scope.updateFixedAsset();

}]);