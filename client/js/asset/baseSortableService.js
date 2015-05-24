'use strict';

var asset = angular.module('asset');

asset.factory('baseService', [function () {

	function getItemsInternal (items) {
		var itemsCopy = [];

		items.forEach(function (item) {
			itemsCopy.push(item);
		})

		return itemsCopy;
	}

	function addItemInternal (items, newItem, sortStrategy) {
		items.push(newItem);

		items.sort(sortStrategy)

		return getItemsInternal(items);
	}

	function removeItemInternal (items, itemToRemove, sortStrategy) {
		items.splice(itemToRemove.index, 1);

		items.sort(sortStrategy)

		return getItemsInternal(items);
	}

	function findItemsInternal (items, fn) {
		var subItems = [];
		
		items.forEach(function (item) {
			if (fn(item)) {
				subItems.push(item);
			}
		})

		return subItems;
	}

	function createService (items, sortStrategy) {

		sortStrategy = sortStrategy || function(){return 0;};
		
		function getItems () {
			return getItemsInternal(items);
		}

		function addItem (newItem) {
			return addItemInternal(items, newItem, sortStrategy);
		}

		function removeItem (itemToRemove) {
			return removeItemInternal(items, itemToRemove, sortStrategy);
		}

		function findItems (fn) {
			return findItemsInternal(items, fn)
		}

		return {
			getItems: getItems,
			addItem: addItem,
			removeItem: removeItem,
			findItems: findItems
		}

	}

	return {
		createService: createService
	}

}]);