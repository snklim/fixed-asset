'use strict';

var asset = angular.module('asset');

asset.factory('purchasesService', ['periodsService', function (periodsService) {

	var purchases = [
		{index:0,price:225,period:{year:2015,number:1}}
	];

	function getPurchases () {
		var arr = [];

		purchases.forEach(function (p) {
			arr.push(p);
		})

		return arr;
	}
	
	function getFixedAssetCurrentValue (period) {
		var currentValue = 0;

		purchases.forEach(function (purchase) {
			if (periodsService.getPeriodKey(purchase.period) == periodsService.getPeriodKey(period)) {
				currentValue += purchase.price;
			}
		});

		return currentValue;
	}

	return {
		getPurchases: getPurchases,
		getFixedAssetCurrentValue: getFixedAssetCurrentValue
	};

}]);