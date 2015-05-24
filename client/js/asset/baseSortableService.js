'use strict';

var asset = angular.module('asset');

asset.factory('baseService', [function () {

	function sortInternal (items, sortStrategy) {
		items.sort(sortStrategy);

		items.forEach(function (item, index) {
			item.index = index;
		})
	}

	function getItemsInternal (items) {
		var itemsCopy = [];

		items.forEach(function (item) {
			itemsCopy.push(item);
		})

		return itemsCopy;
	}

	function addItemInternal (items, newItem, sortStrategy) {
		items.push(newItem);

		sortInternal(items, sortStrategy);

		return getItemsInternal(items);
	}

	function removeItemInternal (items, itemToRemove, sortStrategy) {
		items.splice(itemToRemove.index, 1);

		sortInternal(items, sortStrategy);

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

		sortInternal(items, sortStrategy);
		
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