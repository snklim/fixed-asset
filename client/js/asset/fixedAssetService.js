'use strict';

var asset = angular.module('asset');

asset.factory('fixedAssetService', ['utils', 'lifetimeService', 'purchasesService', function (utils, lifetimeService, purchasesService) {

	var _startPeriod;
	var _currentPeriod;
	var _regime;
	var _passedPeriods;
	var _currentValue;

	function setStartPeriod (startPeriod) {
		_startPeriod = startPeriod;
		_currentPeriod = startPeriod;
		_regime = lifetimeService.getRegime(startPeriod);
		_currentValue = purchasesService.getFixedAssetCurrentValue(startPeriod);
		_passedPeriods = 0;
	}

	function getFixedAsset () {

		return {
			startPeriod: _startPeriod,
			currentPeriod: _currentPeriod,
			regime: _regime,
			passedPeriods: _passedPeriods,
			currentValue: _currentValue
		}

	}

	function writeOff (amount) {
		_passedPeriods += 1;
		_currentPeriod = utils.getNextPeriod(_currentPeriod);
		_currentValue = _currentValue - amount + purchasesService.getFixedAssetCurrentValue(_currentPeriod);
		_regime = lifetimeService.getRegime(_currentPeriod);
	}
	
	return {
		getFixedAsset: getFixedAsset,
		setStartPeriod: setStartPeriod,
		writeOff: writeOff
	}

}]);