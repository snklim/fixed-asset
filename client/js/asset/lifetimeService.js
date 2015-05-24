'use strict';

var asset = angular.module('asset');

asset.factory('lifetimeService', ['basePeriodRelatedService', function (basePeriodRelatedService) {

	var baseService = basePeriodRelatedService.createService([
		{period: {year:2015,number:1},lifetime: 20},
		{period: {year:2015,number:11},lifetime: 20},
		{period: {year:2017,number:1},lifetime: 20}
	]);
	
	function getLifetime (period) {

		var items = baseService.findItems(function (item) {
			return item.period.year <= period.year && item.period.number <= period.number
		});

		if (items.length == 0)
			return 20;

		return items[items.length - 1].lifetime;
	}

	return {
		addLifetime: baseService.addItem,
		removeLifetime: baseService.removeItem,
		getLifetimeRegimes: baseService.getItems,
		getLifetime: getLifetime
	}

}]);