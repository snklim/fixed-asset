'use strict';

var asset = angular.module('asset', []);

asset.controller('AssetCtrl', ['$scope', function ($scope) {

	$scope.purchasePrice = 225;
	$scope.purchasePeriodYear = 2015;
	$scope.purchasePeriodNumber = 1;
	$scope.assetLifetime = 20;
	
	$scope.$watchCollection('purchases', dipricitePurchases);
	$scope.$watchCollection('lifetimeRegimes', dipricitePurchases);
	$scope.$watchCollection('systemPeriods', dipricitePurchases);

	$scope.purchases = [
		{index:0,price:225,period:{year:2015,number:1}}
	];

	$scope.systemPeriods = [
		{year:2015,number:12},
		{year:2016,number:5},
		{year:2017,number:6},
		{year:2018,number:3}
	];

	$scope.lifetimeRegimes = [
		{period: {year:2015,number:1},lifetime: 20},
		{period: {year:2015,number:11},lifetime: 20},
		{period: {year:2017,number:1},lifetime: 20}
	];

	$scope.lifetimeRegimes.sort(sortByPeriod);

	$scope.lifetimeRegimes.forEach(function (regime, index) {
		regime.index = index;
	})

	$scope.systemPeriods.forEach(function (p, i) {
		p.index = i;
	})

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

	function getPeriodsForYear(year){
		var periodIndex = -1;

		$scope.systemPeriods.forEach(function (period, index) {
			if (period.year <= year) {
				periodIndex = index;
			}
		})

		if (periodIndex < 0) {
			return 12;
		}

		return $scope.systemPeriods[periodIndex].number;
	}

	function getLifetime (period) {

		var year = period.year,
			number = period.number,
			lifetimeIndex = -1,
			toYear,
			toNumber,
			iterationNumber = 0,
			lifetimeRegimes = $scope.lifetimeRegimes;

		lifetimeRegimes.forEach(function (dr, index) {			
			if(dr.period.year <= period.year && dr.period.number <= period.number)
			{
				lifetimeIndex = index;
			}
		})

		if (lifetimeIndex < 0) {
			return 20;
		}

		return lifetimeRegimes[lifetimeIndex].lifetime
	}

	function dipricitePurchases() {
		var periods = {},
			key,
			passedPeriods,
			startPeriod = $scope.purchases[0].period;

		var purchase = $scope.purchases[0];

		var fixedAsset = {
			lifetime: getLifetime(purchase.period),
			currentValue: getFixedAssetCurrentValue(purchase.period),
			passedPeriods: 0,
			startPeriod: purchase.period,
			currentPeriod: purchase.period
		};

		$scope.periods = [];

		var depreciatedPeriod;

		while (fixedAsset.currentValue > 0) {
			
			depreciatedPeriod = getDepreciationPeriod(fixedAsset.lifetime, fixedAsset.currentValue, fixedAsset.passedPeriods, fixedAsset.startPeriod, fixedAsset.currentPeriod);

			$scope.periods.push(depreciatedPeriod);
			
			fixedAsset.passedPeriods += 1;
			fixedAsset.currentPeriod = getNextPeriod(fixedAsset.currentPeriod);
			fixedAsset.currentValue = depreciatedPeriod.nettBookValue + getFixedAssetCurrentValue(fixedAsset.currentPeriod);
		}
	}

	function getFixedAssetCurrentValue (period) {
		var currentValue = 0;

		$scope.purchases.forEach(function (purchase) {
			if (getPeriodKey(purchase.period) == getPeriodKey(period)) {
				currentValue += purchase.price;
			}
		});

		return currentValue;
	}

	function getNextPeriod (period) {
		var year = period.year;
		var number = period.number;

		number += 1;
		if(number > getPeriodsForYear(year)){
			year += 1;
			number = 1;
		}

		return {
			year: year,
			number: number
		}
	}

	function getPeriodKey (period) {
		return period.year + '/' + period.number;
	}

	function getDepreciationPeriod (lifetime, currentValue, periodIndex, startPeriod, currentPeriod) {
		
		var nettBookValue = currentValue;
		var remainedPeriods;
		var amountToDepreciate;
		var data;

		data = getRemainedPeriods(startPeriod, lifetime, periodIndex);

		remainedPeriods = data.remainedPeriods;

		amountToDepreciate = round(nettBookValue / remainedPeriods, 2);

		nettBookValue = round(nettBookValue - amountToDepreciate, 2);

		return {
			periodIndex: periodIndex, 
			currentPeriod: currentPeriod, 
			nettBookValue: nettBookValue, 
			amount: amountToDepreciate,
			periodsToGo: remainedPeriods - 1,
			passedPeriods: data.passedPeriods + 1
		};	
	}

	function getRemainedPeriods (startPeriod, lifetime, passedIterations) {

		var currentPeriod = {year:startPeriod.year,number:startPeriod.number};
		var nextPeriod;
		var remainedPeriods = round(getPeriodsForYear(startPeriod.year) * 100 / lifetime, 4);
		var factor;
		var passedPeriods = 0;

		while (passedIterations > 0) {

			remainedPeriods -= 1;

			passedPeriods += 1;

			nextPeriod = getNextPeriod(currentPeriod);

			if (nextPeriod.year != currentPeriod.year) {
				factor = getPeriodsForYear(nextPeriod.year)/getPeriodsForYear(currentPeriod.year);
				remainedPeriods = round(factor * remainedPeriods, 4);
				passedPeriods = round(factor * passedPeriods, 4);
			}

			currentPeriod = nextPeriod;

			passedIterations -= 1;
		}

		if (remainedPeriods > 0 && remainedPeriods < 1) {
			remainedPeriods = 1;
		}

		return {remainedPeriods:remainedPeriods,passedPeriods:passedPeriods};

	}

	function round (value, fraction) {
		var factor = Math.pow(10, fraction);
		return Math.round(factor * value) / factor;
	}

}]);
