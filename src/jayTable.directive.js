(function() {
    'use strict';
        
    var app = angular.module("angular-jaydata-table");
    
    app.directive("jayTable", jayTableDirective);
    
    function jayTableDirective($filter, $templateRequest, $compile) {

        return {
            restrict: 'E',
            template: '<div class="table-responsive">' +
                        '<table class="table table-striped table-bordered table-hover"></table>' +
                        '</div>',
            transclude: true,
            scope: {
                list: "=",
                options: "=",
                selectedItems: "=",
                withoutCheckboxes: "@"
            },
            controller: function ($scope, $element, $attrs) {

                $scope.allSelected = false;
                var selected = [];

                if ($scope.options) {
                    $scope.tableOptions = $scope.options.getTableHeader();
                }

                $scope.withoutCheckboxes = angular.isDefined($scope.withoutCheckboxes);

                if ($scope.list) {
                    $scope.$watch("list", function (data) {
                        $scope.allSelected = false;
                        var selected = [];

                        if (data.length > 0) {

                            var objToMap = {
                                IsSelected: false
                            }

                            //Add "IsSelected" property to each item
                            data = data.map(function (obj) {

                                obj.IsSelected = false;

                                return obj;
                            });

                        }

                        $scope.items = data;
                    });

                    $scope.$on("paginationClicked", function (event, list) {
                        if (list === $scope.list) {
                            $scope.selectedItems = [];
                        }
                    });
                } else {
                    $scope.items = [];
                }

                $scope.selectAll = function () {
                    var selected = [];
                    $scope.allSelected = !$scope.allSelected;

                    angular.forEach($scope.items, function (item) {
                        item.IsSelected = $scope.allSelected;
                        if ($scope.allSelected) {
                            selected.push(item);
                        }
                    });

                    $scope.selectedItems = selected;
                }

                $scope.toggleSelected = function (item, event, withoutCheckboxes) {
                    if (!withoutCheckboxes) {
                        $scope.allSelected = false;

                        event.stopPropagation();

                        var element = $(event.target);

                        if (event.shiftKey) {
                            if (window.getSelection()) {
                                window.getSelection().removeAllRanges();
                            }

                            if (selected.length > 0) {
                                var indexElemAlreadySelected = $scope.items.indexOf(selected[0]);
                                var indexElemSelectedNow = $scope.items.indexOf(item);

                                var inicialCount = (indexElemAlreadySelected > indexElemSelectedNow) ? indexElemSelectedNow : indexElemAlreadySelected;
                                var finalCount = (indexElemAlreadySelected > indexElemSelectedNow) ? indexElemAlreadySelected : indexElemSelectedNow;

                                for (var i = inicialCount + 1; i < finalCount; i++) {
                                    $scope.items[i].IsSelected = true;
                                    selected.push($scope.items[i]);
                                }
                            }
                        } else {
                            var isCheckbox = element.is("input[type=checkbox]");
                            //If isn't checkbox, select only the current row
                            if (!event.ctrlKey && !isCheckbox) {
                                selected = [];
                                angular.forEach($scope.items, function (item) {
                                    item.IsSelected = false;
                                });
                            }
                        }

                        //Add item to selected items list
                        item.IsSelected = !item.IsSelected;

                        var index = selected.indexOf(item);
                        if (item.IsSelected) {
                            selected.push(item);
                        } else {
                            selected.splice(index, 1);
                        }

                        $scope.selectedItems = selected;
                    }
                }

                $scope.processColumn = function (item, option) {
                    var column;

                    if (typeof option.children == "object") {
                        function obj() {
                            this.format = option.multiColFormat;
                        }

                        for (var index in option.children) {
                            column = ref(item, option.children[index].column);

                            if (!(angular.isUndefined(option.children[index].format) || option.children[index].format == null)) {
                                column = getFormattedProperty(column, option.children[index].format);
                            }

                            obj.prototype[index] = column;
                        }

                        var t = new obj();
                        column = t.format();
                    } else {
                        column = ref(item, option.column);

                        if (!(angular.isUndefined(option.format) || option.format == null)) {
                            column = getFormattedProperty(column, option.format);
                        }
                    }

                    return column;
                }
            },
            compile: function ($element, $attrs, transclude) {

                return function ($scope) {

                    transclude($scope, function (clone) {
                        var table = $element.find('table');

                        var html;
                        if (clone.length == 0) {
                            html = '<jay-table-head default="true"></jay-table-head>' + '<jay-table-body default="true"></jay-table-body>';
                        } else {
                            html = clone;
                        }

                        table.append(angular.element(html));
                        $compile(table)($scope);
                    });
                }
            }
        }

        function ref(obj, str) {
            var ret = obj;
            str = str.split(".");
            for (var i = 0; i < str.length; i++) {
                if (ret[str[i]]) {
                    ret = ret[str[i]];
                } else {
                    return null;
                }
            }
            return ret;
        }

        function getFormattedProperty(item, format) {
            var formatted = null;

            if ((typeof format) == "string") {
                formatted = $filter(format)(item);
            } else if ((typeof format) == "object") {

                var filterName;
                var filterValue;

                angular.forEach(format, function (value, key) {
                    filterName = key;
                    filterValue = value;
                });

                if (angular.isDefined(item)) {
                    formatted = $filter(filterName)(item, filterValue);
                }
            }

            return formatted;
        }
    }
    
})();