'use strict';

var asset = angular.module('asset');

asset.factory('lifetimeService', [function () {

	var lifetimeRegimes = [
		{period: {year:2015,number:1},lifetime: 20},
		{period: {year:2015,number:11},lifetime: 20},
		{period: {year:2017,number:1},lifetime: 20}
	];

	function getLifetimeRegimes (argument) {
		var arr = [];

		lifetimeRegimes.forEach(function (l) {
			arr.push(l);
		});

		return arr;
	}
	
	function getLifetime (period) {

		var year = period.year,
			number = period.number,
			lifetimeIndex = -1,
			toYear,
			toNumber,
			iterationNumber = 0;

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

	return {
		getLifetimeRegimes: getLifetimeRegimes,
		getLifetime: getLifetime
	}

}]);