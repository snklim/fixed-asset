'use strict';

var asset = angular.module('asset');

asset.factory('depreciationService', ['utils', 'remainedPeriodsService', 'purchasesService', 'lifetimeService', 'periodsService',
	function (utils, remainedPeriodsService, purchasesService, lifetimeService, periodsService) {

	function depreciatePurchases() {

		var purchases = purchasesService.getPurchases()

		var periods = {},
			key,
			passedPeriods,
			startPeriod =  purchases[0].period;

		var purchase = purchases[0];

		var fixedAsset = {
			lifetime: lifetimeService.getLifetime(purchase.period),
			currentValue: purchasesService.getFixedAssetCurrentValue(purchase.period),
			passedPeriods: 0,
			startPeriod: purchase.period,
			currentPeriod: purchase.period
		};

		var ret = [];

		var depreciatedPeriod;

		while (fixedAsset.currentValue > 0) {
			
			depreciatedPeriod = getDepreciationPeriod(fixedAsset.lifetime, fixedAsset.currentValue, fixedAsset.passedPeriods, fixedAsset.startPeriod, fixedAsset.currentPeriod);

			ret.push(depreciatedPeriod);
			
			fixedAsset.passedPeriods += 1;
			fixedAsset.currentPeriod = periodsService.getNextPeriod(fixedAsset.currentPeriod);
			fixedAsset.currentValue = depreciatedPeriod.nettBookValue + purchasesService.getFixedAssetCurrentValue(fixedAsset.currentPeriod);
		}

		return ret;
	}

	function getDepreciationPeriod (lifetime, currentValue, periodIndex, startPeriod, currentPeriod) {
		
		var nettBookValue = currentValue;
		var remainedPeriods;
		var amountToDepreciate;
		var data;

		data = remainedPeriodsService.getRemainedPeriods(startPeriod, lifetime, periodIndex);

		remainedPeriods = data.remainedPeriods;

		amountToDepreciate = utils.round(nettBookValue / remainedPeriods, 2);

		nettBookValue = utils.round(nettBookValue - amountToDepreciate, 2);

		return {
			periodIndex: periodIndex, 
			currentPeriod: currentPeriod, 
			nettBookValue: nettBookValue, 
			amount: amountToDepreciate,
			periodsToGo: remainedPeriods - 1,
			passedPeriods: data.passedPeriods + 1
		};	
	}

	return {
		depreciatePurchases: depreciatePurchases,
		getDepreciationPeriod: getDepreciationPeriod
	};

}]);