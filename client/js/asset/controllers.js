'use strict';

var asset = angular.module('asset');

asset.controller('AssetCtrl', ['$scope', 'utils', 'remainedPeriodsService', 'periodsService', 'depreciationService', 'purchasesService', 'lifetimeService',
	function ($scope, utils, remainedPeriodsService, periodsService, depreciationService, purchasesService, lifetimeService) {

	$scope.purchasePrice = 225;
	$scope.purchasePeriodYear = 2015;
	$scope.purchasePeriodNumber = 1;
	$scope.assetLifetime = 20;
	
	$scope.$watchCollection('purchases', depreciatePurchases);
	$scope.$watchCollection('lifetimeRegimes', depreciatePurchases);
	$scope.$watchCollection('systemPeriods', depreciatePurchases);

	$scope.systemPeriods = periodsService.getSystemPeriods();

	$scope.purchases = purchasesService.getPurchases();

	$scope.lifetimeRegimes = lifetimeService.getLifetimeRegimes();

	$scope.lifetimeRegimes.sort(sortByPeriod);

	$scope.lifetimeRegimes.forEach(function (regime, index) {
		regime.index = index;
	})

	$scope.systemPeriods.forEach(function (p, i) {
		p.index = i;
	})

	function depreciatePurchases () {
		$scope.periods = depreciationService.depreciatePurchases();
	};

	$scope.addPeriod = function () {
		$scope.systemPeriods.push({
			year: $scope.periodYear,
			number: $scope.periodNumber
		});
		$scope.systemPeriods.sort(function (a, b) {
			return a.year == b.year ? 0 : (a.year < b.year ? -1 : 1)
		});
		$scope.systemPeriods.forEach(function (p, i) {
			p.index = i;
		})
	}

	$scope.removePeriod = function (period) {
		$scope.systemPeriods.splice(period.index, 1);
		$scope.systemPeriods.forEach(function (p, i) {
			p.index = i;
		})
	}

	$scope.addLifetime = function () {
		$scope.lifetimeRegimes.push({
			period: {year: $scope.lifetimePeriodYear, number: $scope.lifetimePeriodNumber},
			lifetime: $scope.assetLifetime
		})
		$scope.lifetimeRegimes.sort(sortByPeriod);
		$scope.lifetimeRegimes.forEach(function (l, i) {
			l.index = i;
		})
	}

	$scope.removeRegime = function (regime) {
		$scope.lifetimeRegimes.splice(regime.index, 1);
		$scope.lifetimeRegimes.forEach(function(r, i){
			r.index = i;
		})
	}

	$scope.addPurchase = function () {
		$scope.purchases.push({
			index: $scope.purchases.length,
			price: $scope.purchasePrice,
			period: {year: $scope.purchasePeriodYear, number: $scope.purchasePeriodNumber},
		});

		$scope.purchases.sort(sortByPeriod);

		$scope.purchases.forEach(function (p, i) {
			p.index = i;
		})
	}

	$scope.removePurchase = function (purchase) {
		$scope.purchases.splice(purchase.index, 1);
		$scope.purchases.forEach(function(p, i){
			p.index = i;
		});
	}

	function sortByPeriod (a, b) {
		return a.period.year != b.period.year ?
			(a.period.year < b.period.year ? -1 : 1) : 
			(a.period.number == b.period.number ? 0 : 
				(a.period.number < b.period.number ? -1 : 1))
	}

	

}]);