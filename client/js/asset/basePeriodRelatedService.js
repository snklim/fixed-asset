'use strict';

var asset = angular.module('asset');

asset.factory('basePeriodRelatedService', ['baseService', 'periodsService', function (baseService, periodsService) {

	function createService (items) {
		return baseService.createService(items, periodsService.sortByPeriod);
	}

	return {
		createService: createService
	}
}]);