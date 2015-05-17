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

	function getIterationNumberAndLifetime (period) {

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
			return {
				iterationNumber: 10000,
				lifetime: 20
			}
		}

		if (lifetimeIndex == lifetimeRegimes.length - 1) {
			return {
				iterationNumber: 10000,
				lifetime: lifetimeRegimes[lifetimeIndex].lifetime
			}
		}

		toYear = lifetimeRegimes[lifetimeIndex + 1].period.year;
		toNumber = lifetimeRegimes[lifetimeIndex + 1].period.number;
		
		while (year < toYear || (year == toYear && number < toNumber)) {
			iterationNumber += 1;
			number += 1;
			if(number > getPeriodsForYear(year)){
				year += 1;
				number = 1;
			}
		}

		return {
			iterationNumber: iterationNumber,
			lifetime: lifetimeRegimes[lifetimeIndex].lifetime
		}
	}

	function dipricitePurchases() {
		var periods = {},
			key,
			passedPeriods;

		$scope.purchases.forEach(function (purchase){

			key = getPeriodKey(purchase.period);
			passedPeriods = periods[key] && periods[key][0].passedPeriods || 0;

			depretiatePurchaseCompletely(purchase, passedPeriods).forEach(function (period) {
				key = getPeriodKey(period.currentPeriod);
				periods[key] = periods[key] || [];
				periods[key].push(period);
			})

		});		

		$scope.periods = margePeriods(periods);
	}

	function depretiatePurchaseCompletely (purchase, passedPeriods) {

		var iterationNumberAndLifetime,
			iterationNumber,
			lifetime,
			periods = [],
			lastItem,
			period;

		iterationNumberAndLifetime = getIterationNumberAndLifetime(purchase.period);

		iterationNumber = iterationNumberAndLifetime.iterationNumber;
		lifetime = iterationNumberAndLifetime.lifetime;

		while (true) {
			depreciatePurchase(lifetime, purchase, passedPeriods, iterationNumber).forEach(function (item) {
				periods.push(item);
			});
			
			lastItem = periods[periods.length - 1];

			if (lastItem.periodsToGo > 0) {
				period = getNextPeriod(lastItem.currentPeriod);
				iterationNumberAndLifetime = getIterationNumberAndLifetime(period);
				
				iterationNumber = iterationNumberAndLifetime.iterationNumber;
				lifetime = iterationNumberAndLifetime.lifetime;

				passedPeriods = lastItem.passedPeriods;

				purchase = {
					price: lastItem.nettBookValue,
					period: period
				}

				continue;
			}

			break;
		}

		return periods;
	}

	function margePeriods (periods) {
		var ret = [],
			key,
			items,
			period;

		for (key in periods) {
			if (periods.hasOwnProperty(key)) {
				items = periods[key];
				period = items[0];
				items.splice(1, items.length).forEach(function (item) {
					period.amount = round(period.amount + item.amount, 2);
					period.nettBookValue = round(period.nettBookValue + item.nettBookValue, 2);
				})
				ret.push(period);
			}
		}

		return ret;
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

	function depreciatePurchase (assetLifetime, purchase, passedPeriods, iterationNumber) {

		passedPeriods = passedPeriods || 0;

		var price = purchase.price,
			currentPeriod = {year: purchase.period.year, number: purchase.period.number},
			periodsToGo = round(getPeriodsForYear(currentPeriod.year) * 100 / assetLifetime - passedPeriods, 4),
			nettBookValue = price,
			amount,
			periods = [],
			factor,
			nextPeriod;

		while (periodsToGo > 0 && iterationNumber > 0) {

			if (periodsToGo > 0 && periodsToGo < 1) {
				periodsToGo = 1;
			}

			passedPeriods = round(passedPeriods + 1, 4);
			amount = round(nettBookValue / periodsToGo, 2);
			nettBookValue = round(nettBookValue - amount, 2);
			periodsToGo = round(periodsToGo - 1, 4);

			nextPeriod = getNextPeriod(currentPeriod);

			if (currentPeriod.year != nextPeriod.year) {
				factor = getPeriodsForYear(nextPeriod.year) / getPeriodsForYear(nextPeriod.year - 1);
				periodsToGo = round(periodsToGo * factor, 4);
				passedPeriods = round(passedPeriods * factor, 4);
			}

			periods.push({
				index: periods.length,
				passedPeriods: passedPeriods,
				periodsToGo: periodsToGo,
				nettBookValue: nettBookValue, 
				amount: amount,
				currentPeriod: {year:currentPeriod.year,number:currentPeriod.number}
			});

			iterationNumber -= 1;
			currentPeriod = nextPeriod;
		}

		return periods;
	}

	function round (value, fraction) {
		var factor = Math.pow(10, fraction);
		return Math.round(factor * value) / factor;
	}

}]);
