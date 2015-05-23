'use strict';

var asset = angular.module('asset');

asset.factory('utils', [function () {

	function round (value, fraction) {
		var factor = Math.pow(10, fraction);
		return Math.round(factor * value) / factor;
	}

	return {
		round: round
	};

}]);