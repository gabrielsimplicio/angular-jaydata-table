(function () {

    angular
        .module("jaydata-table", ['jaydata'])

        .directive("jayTable", function ($filter, $templateRequest, $compile) {

            return {
                restrict: 'E',
                template: '<div class="table-responsive">' +
                            '<table class="table table-striped table-bordered table-hover"></table>' +
                            '</div>',
                transclude: true,
                scope: {
                    list: "=",
                    options: "=",
                    selectedItems: "="
                },
                controller: function ($scope, $element, $attrs) {

                    $scope.allSelected = false;
                    var selected = [];

                    if ($scope.options) {
                        $scope.tableOptions = $scope.options.getTableHeader();
                    }

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

                    $scope.toggleSelected = function (item, event) {
                        $scope.allSelected = false;

                        event.stopPropagation();

                        var element = $(event.target);

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

        })

        .directive("jayTableHead", function ($compile) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                require: '^jayTable',
                template: '<thead>' +
                            '<tr script-transclude>' +
                                '<th ng-if="items" style="width: 8px !important">' +
                                    '<input type="checkbox" ng-checked="allSelected" ng-click="selectAll()" />' +
                                '</th>' +
                                '<th ng-repeat="option in tableOptions">' +
                                    '{{ option.title }}' +
                                '</th>' +
                            '</tr>' +
                        '</thead>',
                link: function ($scope, $element, $attrs) {
                    $scope.default = $attrs.default;
                    if (!$scope.default) {
                        $scope.colspan = angular.isDefined($attrs.colspan) ? $attrs.colspan : 0;
                    }
                }
            }
        })

        .directive("jayTableBody", function ($compile, $parse) {

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                require: '^jayTable',
                template: '<tbody>' +
                                '<tr ng-if="items.length == 0">' +
                                    '<td colspan="{{ default ? tableOptions.length + 1 : noContentColspan + 1 }}" style="text-align: center"><i>Não há conteúdo para ser exibido.</i></td>' +
                                '</tr>' +
                                '<tr ng-if="default" ng-repeat="item in items" ng-click="toggleSelected(item, $event)" style="cursor: pointer" ng-style="{ \'background-color\': item.IsSelected ? \'#fbebbc\': \'\' }">' +
                                    '<td>' +
                                        '<input type="checkbox" ng-checked="item.IsSelected" ng-click="toggleSelected(item, $event)" style="cursor: pointer"/>' +
                                    '</td>' +
                                    '<td ng-repeat="option in tableOptions">' +
                                        '{{ processColumn(item, option) }}' +
                                    '</td>' +
                                '</tr>' +
                                '<tr ng-if="!default" ng-repeat="item in items" ng-click="toggleSelected(item, $event)" style="cursor: pointer" ng-style="{ \'background-color\': item.IsSelected ? \'#fbebbc\': \'\' } " script-transclude></tr>' +
                            '</tbody>'
            }
        })

        .directive('scriptTransclude', function () {
            return {
                controller: function ($scope, $element, $attrs) {
                    $scope.$watch(function () {
                        return $element;
                    }, function (row) {
                        $scope.noContentColspan = row.children().length == 0 ? 1 : row.children().length;
                    });
                },
                compile: function (el, attrs, transcludeFn) {
                    if (angular.isFunction(transcludeFn)) {
                        transcludeFn(el, function (cl) {
                            var clone = $(cl);
                            var elem = $(el);
                            var isHeader = elem.parent().is("thead");

                            $content = clone.filter('script').text();

                            if ($content.length > 0) {

                                if (!isHeader) {
                                    elem.append('<td><input type="checkbox" ng-checked="item.IsSelected" ng-click="toggleSelected(item, $event)" style="cursor: pointer"/></td>');

                                    if ($content.indexOf("<td>") > -1) {
                                        elem.append($content.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));
                                    } else {
                                        elem.append('<td>' + $content + '</td>');
                                    }
                                } else {
                                    elem.append($content.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));
                                }
                            } else {
                                if (isHeader) {
                                    elem.append('<th class="is-not-checkbox" ng-if="!default" colspan="{{colspan}}"></th>');

                                    if (clone) {
                                        var th = elem.find("th.is-not-checkbox");
                                        th.append(clone);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        })

        .directive("jayTablePagination", function () {

            return {
                restrict: 'E',
                template: '<div class="btn-group">' +
                                '<span style="float:left; margin: 15px 8px 0 0">{{ currentPage }}/{{ numberOfPages }}</span>' +
                                '<button class="btn btn-default navbar-btn" ng-click="backToPreviousPage()" ng-disabled="currentPage == 1"><i class="icon-arrow-left"></i></button>' +
                                '<button class="btn btn-default navbar-btn" ng-click="goToNextPage()" ng-disabled="currentPage == numberOfPages"><i class="icon-arrow-right"></i></button>' +
                            '</div>',
                scope: {
                    list: "=",
                    render: "="
                },
                controller: function ($scope, $element, $attrs) {

                    if (!angular.isDefined($scope.list)) {
                        console.error("Error at 'jayTablePagination' directive. You must provide an attribute called 'list'.");
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
                            if (angular.isDefined($scope.render)) {
                                $scope.render(data);
                            }
                        });
                    }
                }
            }

        })

        .service("jayTableOptions", function () {

            var tableHeader = [];

            var jayTableOptions = {
                initializeHeader: initializeHeader,
                getTableHeader: getTableHeader
            }

            return jayTableOptions;

            function initializeHeader() {
                tableHeader = [];
                return {
                    addColumn: fnAddColumn
                }
            }

            function getTableHeader() {
                return tableHeader;
            }

            function fnAddColumn(columnName) {
                var newColumn = {
                    column: columnName,
                    title: columnName,
                    format: null
                }
                tableHeader.push(newColumn);

                return {
                    addColumn: fnAddColumn,
                    withTitle: function (columnTitle) {
                        return fnWithTitle(columnTitle, columnName);
                    },
                    addColumns: fnAddColumns
                }
            }

            function fnWithTitle(columnTitle, columnName) {
                addColumnTitle(columnTitle, columnName);

                return {
                    addColumn: fnAddColumn,
                    format: function (columnFormat) {
                        addColumnFormat(columnFormat, columnName);

                        return {
                            addColumn: fnAddColumn,
                            addColumns: fnAddColumns
                        }
                    },
                    addColumns: fnAddColumns
                }
            }

            function fnAddColumns() {

                return {
                    withTitle: function (columnTitle) {
                        var newColumn = {
                            column: columnTitle,
                            title: columnTitle,
                            multiColFormat: null,
                            children: []
                        }

                        return {
                            like: function (format) {
                                newColumn.multiColFormat = format;
                                return {
                                    add: function (columnName) {
                                        return addChild(newColumn, columnTitle, columnName);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function addChild(newColumn, columnTitle, columnName) {
                return {
                    as: function (childTitle) {
                        var tableHeaderItem = getTableHeaderItem("column", columnTitle);
                        if (!tableHeaderItem) {
                            tableHeader.push(newColumn);
                            tableHeaderItem = newColumn;
                        }

                        tableHeaderItem.children[childTitle] = {
                            column: columnName
                        }

                        return {
                            format: function (format) {
                                tableHeaderItem.children[childTitle] = {
                                    column: columnName,
                                    format: format
                                }

                                return {
                                    add: function (columnName) {
                                        return addChild(newColumn, columnTitle, columnName)
                                    },
                                    addColumn: fnAddColumn,
                                    addColumns: fnAddColumns
                                }
                            },
                            add: function (columnName) {
                                return addChild(newColumn, columnTitle, columnName);
                            },
                            addColumn: fnAddColumn,
                            addColumns: fnAddColumns
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

            /*
                * Opções de uso do "format":
                * .format(formato)
                * 
                * formato pode ser:
                *  - uma string: "uppercase", "lowercase", "json";
                *  - um objeto: 
                * var formatObj = {
                *      typeFormat: mask
                * }
                * 
                * - Tipos de formato:
                *  - "date": máscaras: https://docs.angularjs.org/api/ng/filter/date
                *  - "currency": máscaras: https://docs.angularjs.org/api/ng/filter/currency
                * 
                * Para mais componentes, acesse https://docs.angularjs.org/api/ng/filter
                * 
                */
            function addColumnFormat(columnFormat, columnName) {
                angular.forEach(tableHeader, function (option) {
                    if (option.column == columnName) {
                        option.format = columnFormat;
                    }
                });
            }

            function getTableHeaderItem(key, value) {
                for (var i = 0; i < tableHeader.length; i++) {
                    if (tableHeader[i][key] == value) {
                        return tableHeader[i];
                    }
                }
                return null;
            }
        });

})();