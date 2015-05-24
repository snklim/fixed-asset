'use strict';

var asset = angular.module('asset');

asset.factory('lifetimeService', ['basePeriodRelatedService', function (basePeriodRelatedService) {

	var baseService = basePeriodRelatedService.createService([
		{period: {year:2015,number:1}, lifetime: 20, stopvalue: 0, remainedvalue: 0},
		{period: {year:2015,number:11}, lifetime: 20, stopvalue: 0, remainedvalue: 0},
		{period: {year:2017,number:1}, lifetime: 20, stopvalue: 0, remainedvalue: 0}
	]);
	
	function getRegime (period) {

		var items = baseService.findItems(function (item) {
			return item.period.year <= period.year && item.period.number <= period.number
		});

		if (items.length == 0)
			return {lifetime:20,stopvalue:0,remainedvalue:0};

		var regime = items[items.length - 1];

		return {lifetime: regime.lifetime, stopvalue: regime.stopvalue, remainedvalue: regime.remainedvalue};
	}

	return {
		addLifetime: baseService.addItem,
		removeLifetime: baseService.removeItem,
		getLifetimeRegimes: baseService.getItems,
		getRegime: getRegime
	}

}]);