'use strict';

var asset = angular.module('asset');

asset.factory('basePeriodRelatedService', ['baseService', 'utils', function (baseService, utils) {

	function createService (items) {
		return baseService.createService(items, utils.sortByPeriod);
	}

	return {
		createService: createService
	}
}]);