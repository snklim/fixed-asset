'use strict';

var asset = angular.module('asset');

asset.factory('utils', ['periodsService', function (periodsService) {

	function round (value, fraction) {
		var factor = Math.pow(10, fraction);
		return Math.round(factor * value) / factor;
	}

	function getNextPeriod (period) {
		var year = period.year;
		var number = period.number;

		number += 1;
		if(number > periodsService.getPeriodsForYear(year)){
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

	function sortByPeriod (a, b) {
		return a.period.year != b.period.year ?
			(a.period.year < b.period.year ? -1 : 1) : 
			(a.period.number == b.period.number ? 0 : 
				(a.period.number < b.period.number ? -1 : 1))
	}

	return {
		round: round,
		getNextPeriod: getNextPeriod,
		getPeriodKey: getPeriodKey,
		sortByPeriod: sortByPeriod
	};

}]);