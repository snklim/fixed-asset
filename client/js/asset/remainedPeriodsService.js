'use strict';

var asset = angular.module('asset');

asset.factory('remainedPeriodsService', ['utils', 'periodsService', function (utils, periodsService) {

	function getRemainedPeriods (startPeriod, lifetime, passedIterations) {

		var currentPeriod = {year:startPeriod.year,number:startPeriod.number};
		var nextPeriod;
		var remainedPeriods = utils.round(periodsService.getPeriodsForYear(startPeriod.year) * 100 / lifetime, 4);
		var factor;
		var passedPeriods = 0;

		while (passedIterations > 0) {

			remainedPeriods -= 1;

			passedPeriods += 1;

			nextPeriod = periodsService.getNextPeriod(currentPeriod);

			if (nextPeriod.year != currentPeriod.year) {
				factor = periodsService.getPeriodsForYear(nextPeriod.year)/periodsService.getPeriodsForYear(currentPeriod.year);
				remainedPeriods = utils.round(factor * remainedPeriods, 4);
				passedPeriods = utils.round(factor * passedPeriods, 4);
			}

			currentPeriod = nextPeriod;

			passedIterations -= 1;
		}

		if (remainedPeriods > 0 && remainedPeriods < 1) {
			remainedPeriods = 1;
		}

		return {remainedPeriods:remainedPeriods,passedPeriods:passedPeriods};

	}

	return {
		getRemainedPeriods: getRemainedPeriods
	};

}]);