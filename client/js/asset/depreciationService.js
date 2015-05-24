'use strict';

var asset = angular.module('asset');

asset.factory('depreciationService', ['utils', 'remainedPeriodsService', 'fixedAssetService',
	function (utils, remainedPeriodsService, fixedAssetService) {

	function depreciatePurchases() {

		var fixedAsset;

		var periods = [];

		var depreciatedPeriod;

		do {

			fixedAsset = fixedAssetService.getFixedAsset();
			
			depreciatedPeriod = getDepreciationPeriod(fixedAsset.regime, fixedAsset.currentValue, fixedAsset.passedPeriods, fixedAsset.startPeriod, fixedAsset.currentPeriod);

			periods.push(depreciatedPeriod);

			fixedAssetService.writeOff(depreciatedPeriod.amount);

		} while (depreciatedPeriod.periodsToGo > 0)

		return periods;
	}

	function getDepreciationPeriod (regime, currentValue, periodIndex, startPeriod, currentPeriod) {
		
		var remainedPeriods;
		var amountToDepreciate;
		var data;
		var lifetime = regime.lifetime;
		var stopvalue = regime.stopvalue;

		data = remainedPeriodsService.getRemainedPeriods(startPeriod, lifetime, periodIndex);

		remainedPeriods = data.remainedPeriods;

		amountToDepreciate = utils.round((currentValue - regime.remainedvalue) / remainedPeriods, 2);

		if (currentValue - amountToDepreciate < stopvalue) {
			amountToDepreciate = currentValue - stopvalue;
		}

		return {
			periodIndex: periodIndex, 
			currentPeriod: currentPeriod, 
			nettBookValue: utils.round(currentValue - amountToDepreciate, 2), 
			amount: amountToDepreciate,			
			periodsToGo: utils.round(remainedPeriods - 1, 4),
			passedPeriods: utils.round(data.passedPeriods + 1, 4)
		};	
	}

	return {
		depreciatePurchases: depreciatePurchases,
		getDepreciationPeriod: getDepreciationPeriod
	};

}]);