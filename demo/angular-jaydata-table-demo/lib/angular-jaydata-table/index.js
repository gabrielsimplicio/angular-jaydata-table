(function(){

	angular.module('jaydata-table', ['jaydata'])

	.directive("jayTable", function () {

        return {
            restrict: 'E',
            template: '<div class="table-responsive">' +
                        '<table class="table table-striped table-bordered table-hover">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th ng-if="items.length > 0" style="width: 8px !important">' +
                                        '<input type="checkbox" ng-checked="allSelected" ng-click="selectAll()" />' +
                                    '</th>' +
                                    '<th ng-repeat="option in tableOptions">' +
                                        '{{ option.title }}' +
                                    '</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                                '<tr ng-if="items.length == 0">' +
                                    '<td colspan="{{ tableOptions.length }}" style="text-align: center"><i>Não há conteúdo para ser exibido.</i></td>' +
                                '</tr>' +
                                '<tr ng-repeat="item in items" ng-click="toggleSelected(item, $event)" ng-style="{ \'background-color\': item.IsSelected ? \'#fbebbc\': \'\' } ">' +
                                    '<td>' +
                                        '<input type="checkbox" ng-checked="item.IsSelected" ng-click="toggleSelected(item, $event)" />' +
                                    '</td>' +
                                    '<td ng-repeat="option in tableOptions" style="cursor: pointer">' +
                                        '{{ item[option["column"]] }}' +
                                    '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>',
            scope: {
                list: "=",
                options: "=",
                selectedItems: "="
            },
            controller: function ($scope, $element, $attrs) {
                
                $scope.tableOptions = $scope.options.getTableHeader();

                $scope.allSelected = false;
                
                $scope.$watch("list", function (data) {
                    var configuredList = addIsSelectedPropertyToListItems(data);
                    $scope.items = configuredList;
                });

                $scope.selectAll = function () {
                    $scope.allSelected = !$scope.allSelected;
                    $scope.selectedItems = toggleAll($scope.items, $scope.allSelected);
                }

                $scope.toggleSelected = function (item, event) {
                    var _selectedItems = $scope.selectedItems;
                    var element = $(event.target);

                    $scope.allSelected = false;

                    event.stopPropagation();

                    if (event.shiftKey) {
                        removeTextSelection();

                        if (_selectedItems.length > 0) {
                            _selectedItems = selectBetween($scope.items, _selectedItems[0], item);
                        }
                    } else {
                        var isCheckbox = element.is("input[type=checkbox]");

                        if (!event.ctrlKey && !isCheckbox) {
                            _selectedItems = toggleAll($scope.items, false);
                        }
                    }

                    item.IsSelected = !item.IsSelected;

                    var index = _selectedItems.indexOf(item);
                    if (item.IsSelected) {
                        _selectedItems.push(item);
                    } else {
                        _selectedItems.splice(index, 1);
                    }

                    $scope.selectedItems = _selectedItems;
                }
            }
        }
        
        /*
         * Remove text selection from grid
         */
        function removeTextSelection() {
            if (window.getSelection()) {
                window.getSelection().removeAllRanges();
            }
        }

	    /*
         * Add the property "IsSelected" to each item
         * @param oldList
         * @returns {array}
         */
        function addIsSelectedPropertyToListItems(oldList) {

            var newList = [];

            if (oldList.length > 0) {
                newList = oldList.map(function (obj) {
                    return angular.extend(obj, { IsSelected: false });
                })
            }

            return newList;
        }

        function toggleAll(items, selectAll) {

            var _selectedItems = [];

            angular.forEach(items, function (item) {
                item.IsSelected = selectAll;
                if (selectAll) {
                    _selectedItems.push(item);
                }
            });

            return _selectedItems;
        }

	    //Check all items between the first checked item and the item checked now
        function selectBetween(items, first, last) {

            var _selectedItems = [];
            
            var indexFirst = items.indexOf(first);
            var index = items.indexOf(last);

            var init = (indexFirst > index) ? index : indexFirst;
            var final = (indexFirst > index) ? indexFirst : index;

            for (var i = init + 1; i < final; i++) {
                var item = items[i];
                item.IsSelected = true;
                _selectedItems.push(item);
            }

            return _selectedItems;
        }

    })

    .directive("jayTablePagination", function () {

        return {
            restrict: 'E',
            template: '<div class="btn-group">' +
                            '<span style="float:left; margin: 8px 8px 0 0">{{ currentPage }}/{{ numberOfPages }}</span>' +
                            '<button class="btn btn-default" ng-click="backToPreviousPage()" ng-disabled="currentPage == 1"><i class="icon-arrow-left"></i></button>' +
                            '<button class="btn btn-default" ng-click="goToNextPage()" ng-disabled="currentPage == numberOfPages"><i class="icon-arrow-right"></i></button>' +
                        '</div>',
            scope: {
                list: "="
            },
            controller: function ($scope, $element, $attrs) {

                if (!angular.isDefined($scope.list)) {
                    console.error("Error at 'codesTablePagination' directive. You must provide an attribute called 'list'.");
                    return;
                }

                $scope.count = 0;
                $scope.total = 0;

                $scope.numberOfPages = 1;
                $scope.currentPage = 1;

                $scope.nextFn = null;
                $scope.goToNextPage = function () {
                    $scope.currentPage++;
                    $scope.nextFn().then(emmitScopeChanges);
                };

                $scope.prevFn = null;
                $scope.backToPreviousPage = function () {
                    $scope.currentPage--;
                    $scope.prevFn().then(emmitScopeChanges);
                }

                $scope.$watch("list", getItems);

                function getItems(data) {
                    $scope.list = data;

                    $scope.count = data.length;
                    $scope.total = data.totalCount;

                    if ($scope.currentPage == 1 && ($scope.count > 0 && $scope.total > 0)) {
                        $scope.numberOfPages = Math.ceil($scope.total / $scope.count);
                    }

                    $scope.nextFn = data.next;
                    $scope.prevFn = data.prev;
                }

                function emmitScopeChanges(data) {
                    $scope.$apply(function () {
                        getItems(data);
                    });
                }
            }
        }

    })

    .service("jayTableOptions", function () {

        var tableHeader = [];

        var codesTableOptions = {
            initializeHeader: initializeHeader,
            getTableHeader: getTableHeader
        }

        return codesTableOptions;

        function initializeHeader() {
            tableHeader = [];
            return {
                addColumn: addColumn
            }
        }

        function getTableHeader() {
            return tableHeader;
        }

        function addColumn(columnName) {
            var newColumn = {
                column: columnName,
                title: columnName
            }
            tableHeader.push(newColumn);

            return {
                withTitle: function (columnTitle) {
                    addColumnTitle(columnTitle, columnName);

                    return {
                        addColumn: addColumn
                    }
                }
            }
        }

        function addColumnTitle(columnTitle, columnName) {
            angular.forEach(tableHeader, function (option) {
                if (option.column == columnName) {
                    option.title = columnTitle;
                }
            });
        }
    });

})();