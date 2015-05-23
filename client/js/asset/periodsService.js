'use strict';

var asset = angular.module('asset');

asset.factory('periodsService', [function () {
	
	var systemPeriods = [
		{year:2015,number:12},
		{year:2016,number:5},
		{year:2017,number:6},
		{year:2018,number:3}
	];

	function getSystemPeriods (argument) {
		var periods = [];

		systemPeriods.forEach(function (p) {
			periods.push(p);
		});

		return periods;
	}

	function getPeriodsForYear(year){
		var periodIndex = -1;

		systemPeriods.forEach(function (period, index) {
			if (period.year <= year) {
				periodIndex = index;
			}
		})

		if (periodIndex < 0) {
			return 12;
		}

		return systemPeriods[periodIndex].number;
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

	return {
		getSystemPeriods, getSystemPeriods,
		getPeriodsForYear: getPeriodsForYear,
		getNextPeriod: getNextPeriod,
		getPeriodKey: getPeriodKey
	};

}]);