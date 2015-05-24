'use strict';

var asset = angular.module('asset');

asset.factory('periodsService', ['baseService', function (baseService) {
	
	var base = baseService.createService([
		{year:2015,number:12},
		{year:2016,number:5},
		{year:2017,number:6},
		{year:2018,number:3}
	], function (a, b) {
		return a.year == b.year ? 0 : (a.year < b.year ? -1 : 1);
	});

	function getPeriodsForYear(year){

		var items = base.findItems(function (item) {
			return item.year <= year;
		});

		if (items.length == 0)
			return 12;

		return items[items.length - 1].number;
	}

	return {
		getSystemPeriods: base.getItems,
		getPeriodsForYear: getPeriodsForYear,
		addPeriod: base.addItem,
		removePeriod: base.removeItem
	};

}]);