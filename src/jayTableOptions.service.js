(function() {
    'use strict';
    
    var app = angular.module('angular-jaydata-table');
    
    app.service("jayTableOptions", jayTableOptionsService);
    
    function jayTableOptionsService() {
        var tableHeader = [];

        var jayTableOptions = {
            initializeHeader: initializeHeader,
            getTableHeader: getTableHeader
        }

        return jayTableOptions;

        function initializeHeader() {
            tableHeader = [];
            return {
                addColumn: fnAddColumn,
                addColumns: fnAddColumns
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
        * Options using "format":
        * .format(form)
        * 
        * "form" can be:
        *  - string: 
        *           "uppercase", "lowercase", "json";
        *  - object: 
        *           var formatObj = {
        *               typeFormat: mask
        *           }
        * 
        * - format types:
        *  - "date": masks: https://docs.angularjs.org/api/ng/filter/date
        *  - "currency": masks: https://docs.angularjs.org/api/ng/filter/currency
        * 
        * For more components, access https://docs.angularjs.org/api/ng/filter
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
    }
    
})();