'use strict';

var asset = angular.module('asset');

asset.factory('purchasesService', ['periodsService', 'basePeriodRelatedService', 'utils', function (periodsService, basePeriodRelatedService, utils) {

	var baseService = basePeriodRelatedService.createService([
		{price:225,period:{year:2015,number:1}}
	]);
	
	function getFixedAssetCurrentValue (period) {
		var currentValue = 0;

		baseService.findItems(function (item) {
			return utils.getPeriodKey(item.period) == utils.getPeriodKey(period);
		}).forEach(function (item) {
			currentValue += item.price;
		});

		return currentValue;
	}

	return {
		addPurchase: baseService.addItem,
		removePurchase: baseService.removeItem,
		getPurchases: baseService.getItems,
		getFixedAssetCurrentValue: getFixedAssetCurrentValue
	};

}]);