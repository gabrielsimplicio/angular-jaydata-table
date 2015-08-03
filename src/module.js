(function(){

	angular.module('jaydata-table', ['jaydata'])

	.directive("jayTable", function () {

        return {
            restrict: 'E',
            templateUrl: 'src/table.html',
            scope: {
                list: "=",
                options: "=",
                selectedItems: "="
            },
            controller: function ($scope, $element, $attrs) {
                
                $scope.tableOptions = $scope.options.getTableHeader();

                $scope.allSelected = false;
                var selected = [];
                
                $scope.$watch("list", function (data) {

                    if (data.length > 0) {
                        //Add the object "IsSelected" to each item
                        data = data.map(function (obj) {
                            return angular.extend(obj, { IsSelected: false });
                        })
                    }

                    $scope.items = data;
                });

                $scope.toggleSelected = function (item, event) {
                    item.IsSelected = !item.IsSelected;
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
                }

                $scope.toggleSelected = function (item, event) {
                    $scope.allSelected = false;

                    event.stopPropagation();

                    var element = angular.element(event.target);

                    if (event.shiftKey) {
                        //remove a seleção do texto da grid
                        if (window.getSelection()) {
                            window.getSelection().removeAllRanges();
                        }

                        //Marca todos os elementos entre o recém-selecionado e o já previamente selecionado (caso haja)
                        if (selected.length > 0) {
                            var indexElemJaSelecionado = $scope.items.indexOf(selected[0]);
                            var indexElemRecemSelecionado = $scope.items.indexOf(item);

                            var contadorInicial = (indexElemJaSelecionado > indexElemRecemSelecionado) ? indexElemRecemSelecionado : indexElemJaSelecionado;
                            var contadorFinal = (indexElemJaSelecionado > indexElemRecemSelecionado) ? indexElemJaSelecionado : indexElemRecemSelecionado;

                            for (var i = contadorInicial + 1; i < contadorFinal; i++) {
                                $scope.items[i].IsSelected = true;
                                selected.push($scope.items[i]);
                            }
                        }
                    } else {
                        var isCheckbox = element.is("input[type=checkbox]");
                        //Se não for checkbox, seleciona somente a linha atual
                        if (!event.ctrlKey && !isCheckbox) {
                            selected = [];
                            angular.forEach($scope.items, function (item) {
                                item.IsSelected = false;
                            });
                        }
                    }

                    //Adiciona o item na lista de itens selecionados
                    item.IsSelected = !item.IsSelected;

                    var index = selected.indexOf(item);
                    if (item.IsSelected) {
                        selected.push(item);
                    } else {
                        selected.splice(index, 1);
                    }

                    $scope.selectedItems = selected;
                }
            },
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