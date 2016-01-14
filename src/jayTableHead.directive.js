(function() {
    'use strict';
        
    var app = angular.module("angular-jaydata-table");
    
    app.directive("jayTableHead", jayTableHeadDirective);

    function jayTableHeadDirective($compile) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^jayTable',
            template: '<thead>' +
                        '<tr script-transclude>' +
                            '<th ng-if="items && !noCheckBox" style="width: 8px !important">' +
                                '<input type="checkbox" ng-checked="allSelected" ng-click="selectAll()" />' +
                            '</th>' +
                            '<th ng-repeat="option in tableOptions">' +
                                '{{ option.title }}' +
                            '</th>' +
                        '</tr>' +
                    '</thead>',
            link: function ($scope, $element, $attrs) {
                $scope.noCheckBox = $scope.withoutCheckboxes;

                $scope.default = $attrs.default;
                if (!$scope.default) {
                    $scope.colspan = angular.isDefined($attrs.colspan) ? $attrs.colspan : 0;
                }
            }
        }
    }

})();